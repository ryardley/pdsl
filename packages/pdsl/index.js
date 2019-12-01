const { parser } = require("./parser");
const { lexer } = require("./lexer");
const { generator } = require("./generator");
const { getRawHelpers } = require("./helpers");
const { pretokenizer } = require("./pretokenizer");
const { pred } = getRawHelpers();
const { ValidationError } = require("./errors");
const Context = require("./context");

// Utility functions
const flow = (...funcs) => input =>
  funcs.reduce((out, func) => func(out), input);

const debugRpnArray = rpnArray => rpnArray.map(a => a.toString()).join(" ");

function debugRpn(strings) {
  return flow(toRpnArray, debugRpnArray)(strings);
}

function debugTokens(strings) {
  return flow(pretokenizer, lexer, debugRpnArray)(strings);
}

// Prepare the compiler
const cleanup = a => a.filter(Boolean);

const toRpnArray = flow(pretokenizer, lexer, parser, cleanup);

const createPredicateCompiler = (options = {}) => (strings, ...expressions) => {
  const ctx = new Context(options);

  const predicate = generator(
    toRpnArray(strings),
    expressions.map(pred(ctx)),
    ctx
  );

  const validateSync = input => {
    // Setting abortEarly to false
    // enables us to collect all errors
    ctx.reset({ abortEarly: false });

    // Run the test
    predicate(input);
    const errs = ctx.getErrors();

    // Throw errors
    if (ctx.throwErrors && errs.length > 0) {
      if (errs.length > 1) {
        throw new ValidationError("PDSL validation failed", "", errs);
      } else {
        const [singleError] = errs;
        throw new ValidationError(singleError.message, singleError.path);
      }
    }

    // Return the errors
    return errs;
  };

  // Whilst async validations are not possible
  // this is done to comply to formik's schemaValidator specification
  const validate = async input => {
    return validateSync(input);
  };

  predicate.validate = validate;
  predicate.validateSync = validateSync;
  predicate.unsafe_rpn = () => debugRpn(strings);

  return predicate;
};

const predicateCompiler = createPredicateCompiler();

predicateCompiler.create = createPredicateCompiler;
predicateCompiler.unsafe_rpn = debugRpn;
predicateCompiler.unsafe_tokens = debugTokens;

module.exports = predicateCompiler;
module.exports.default = predicateCompiler;
module.exports.unsafe_toRpnArray = toRpnArray;
