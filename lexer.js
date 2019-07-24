const { grammar } = require("./grammar");

const rex = new RegExp(`(${Object.keys(grammar).join("|")})`, "g");

function lexer(input) {
  rex.lastIndex = 0;
  return input.replace(/\/\/.*(\n|$)/g, "").match(rex);
}

module.exports = { lexer };
