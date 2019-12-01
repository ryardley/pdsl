const { parser } = require("./parser");
const { lexer } = require("./lexer");
const { generator } = require("./generator");
const { getRawHelpers } = require("./helpers");
const { pretokenizer } = require("./pretokenizer");
const { pred } = getRawHelpers();

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
const defaultContext = { abortEarly: true };

const createPredicateCompiler = (options = {}) => (strings, ...expressions) => {
  // TODO: Extract context out to it's own class

  const ctx = Object.assign({}, defaultContext, options);
  ctx.errs = [];
  ctx.objStack = [];

  ctx.batchStart = function batchStart() {
    ctx.isBatching = true;
  };

  ctx.batchCommit = function batchCommit() {
    ctx.errs = ctx.errs.concat(ctx.batch);
  };

  ctx.batchPurge = function batchPurge() {
    ctx.batch = [];
    ctx.isBatching = false;
  };

  ctx.batchPurge();

  ctx.reportError = function reportError(msg, ...argstore) {
    const message = msg.replace(/\$(\d+)/g, (...matchArgs) => {
      const [, argIndex] = matchArgs.slice(0, -2);
      return argstore[Number(argIndex) - 1] || "";
    });
    const collection = ctx.isBatching ? ctx.batch : ctx.errs;

    collection.push({
      path: ctx.objStack.join("."),
      message
    });
  };

  ctx.pushObjStack = function pushObjStack(key) {
    const out = ctx.objStack.push(key);

    return out;
  };

  ctx.popObjStack = function popObjStack() {
    const key = ctx.objStack.pop();
    return key;
  };

  const predicate = generator(
    toRpnArray(strings),
    expressions.map(pred(ctx)),
    ctx
  );

  const validate = input => {
    ctx.errs = [];
    ctx.objStack = [];
    // Setting abortEarly to false
    // enables us to collect all errors
    ctx.abortEarly = false;

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
