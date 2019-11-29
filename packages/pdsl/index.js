const { parser } = require("./parser");
const { lexer } = require("./lexer");
const { generator } = require("./generator");
const { getRawHelpers } = require("./helpers");
const { pretokenizer } = require("./pretokenizer");
const { pred } = getRawHelpers();

const flow = (...funcs) => input =>
  funcs.reduce((out, func) => func(out), input);

const debugAst = ast => ast.map(a => a.toString()).join(" ");

const cleanup = a => a.filter(Boolean);

const toAst = flow(pretokenizer, lexer, parser, cleanup);

const configP = ctx => (strings, ...expressions) => {
  return generator(toAst(strings), expressions.map(pred(ctx)), ctx);
};

function config(ctx) {
  return configP(ctx);
}

const defaultContext = {};

const p = configP(defaultContext);

function debugRpn(strings) {
  return flow(toAst, debugAst)(strings);
}

function debugTokens(strings) {
  return flow(pretokenizer, lexer, debugAst)(strings);
}

p.unsafe_rpn = debugRpn;
p.unsafe_tokens = debugTokens;
p.config = config;

module.exports = p;
module.exports.default = p;
module.exports.unsafe_toAst = toAst;
