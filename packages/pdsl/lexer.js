const { OPERATORS, IDENTIFIERS, PRECEDENCE, LINKAGES } = require("./grammar");

const TOKENS = OPERATORS.concat(IDENTIFIERS)
  .concat(PRECEDENCE)
  .concat(LINKAGES)
  .map(o => o.token);

const rex = new RegExp(`(${TOKENS.join("|")})`, "g");

function lexer(input) {
  return input.match(rex);
}

module.exports = { lexer };
