const { parser } = require("./parser");
const { lexer } = require("./lexer");
const { generator } = require("./generator");
const { pred } = require("./helpers");
const { pretokenizer } = require("./pretokenizer");

function p(strings, ...expressions) {
  const pretokenized = pretokenizer(strings);
  const tokenized = lexer(pretokenized);
  const ast = parser(tokenized);
  return generator(ast.filter(Boolean), expressions.map(pred));
}

module.exports = p;
module.exports.default = p;
