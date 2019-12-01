const { parser } = require("./parser");
const { lexer } = require("./lexer");
const { generator } = require("./generator");
const { getRawHelpers } = require("./helpers");
const { pretokenizer } = require("./pretokenizer");
const { pred } = getRawHelpers();
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

  const validate = input => {
    // Setting abortEarly to false
    // enables us to collect all errors
    ctx.reset({ abortEarly: false });

    // Run the test
    predicate(input);

    // Return the errors
    return ctx.errs;
  };

  predicate.validate = validate;
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
