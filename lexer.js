const TOKENS = [
  `\\,`,
  `\\:`,
  `\\!`,
  `\\&\\&`,
  `\\|\\|`,
  `\\{`,
  `\\}`,
  `\\(`,
  `\\)`,
  `_E\\d+`,
  `[a-zA-Z0-9_-]+`
];

const rex = new RegExp(`(${TOKENS.join("|")})`, "g");

function lexer(input) {
  return input.match(rex);
}

module.exports = { lexer };
