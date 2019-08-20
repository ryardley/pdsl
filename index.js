const { parser } = require("./parser");
const { lexer } = require("./lexer");
const { generator } = require("./generator");
const { pred } = require("./helpers");
const { pretokenizer } = require("./pretokenizer");

const flow = (...funcs) => input =>
  funcs.reduce((out, func) => func(out), input);

const debugAst = ast => ast.map(a => a.toString()).join(" ");

const cleanup = a => a.filter(Boolean);

const toAst = flow(
  pretokenizer,
  lexer,
  parser,
  cleanup
);

function p(strings, ...expressions) {
  return generator(toAst(strings), expressions.map(pred));
}

function debugRpn(strings) {
  return flow(
    toAst,
    debugAst
  )(strings);
}

function debugTokens(strings) {
  return flow(
    pretokenizer,
    lexer,
    debugAst
  )(strings);
}

p.unsafe_rpn = debugRpn;
p.unsafe_ast = toAst;
p.unsafe_tokens = debugTokens;

module.exports = p;
module.exports.default = p;
