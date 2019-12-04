const { parser } = require("./parser");
const { lexer } = require("./lexer");
const { generator } = require("./generator");
const { getRawHelpers, createDefault } = require("./helpers");
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

const cleanup = a => a.filter(Boolean);

const toRpnArray = flow(pretokenizer, lexer, parser, cleanup);

const compileTemplateLiteral = (strings, expressions, ctx) => {
  const predicateFn = generator(
    toRpnArray(strings),
    expressions.map(pred(ctx)),
    ctx
  );
  predicateFn.unsafe_rpn = () => debugRpn(strings);
  return predicateFn;
};

// Create the default export for runtime compiling
const defaultExport = createDefault(compileTemplateLiteral);

defaultExport.unsafe_rpn = debugRpn;
defaultExport.unsafe_tokens = debugTokens;

module.exports = defaultExport;
module.exports.default = defaultExport;
module.exports.unsafe_toRpnArray = toRpnArray;
