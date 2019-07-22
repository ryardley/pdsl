const { OPERATORS, IDENTIFIERS, PRECEDENCE } = require("./config");

const TOKENS = OPERATORS.concat(IDENTIFIERS)
  .concat(PRECEDENCE)
  .map(o => o.token);

const rex = new RegExp(`(${TOKENS.join("|")})`, "g");

function lexer(input) {
  return input.match(rex);
}

module.exports = { lexer };
