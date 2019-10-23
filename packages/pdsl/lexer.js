const { grammar } = require("./grammar");

const rex = new RegExp(`(${Object.keys(grammar).join("|")})`, "g");

const grammers = Object.entries(grammar);

function toNode(token) {
  for (let i = 0; i < grammers.length; i++) {
    const [test, createNode] = grammers[i];
    const testPassed = new RegExp(`^${test}$`).test(token);
    if (testPassed) {
      return createNode(token);
    }
  }
}

function lexer(input) {
  rex.lastIndex = 0;
  return input
    .replace(/\/\/.*(\n|$)/g, "") // remove comments
    .match(rex)
    .map(toNode);
}

module.exports = { lexer };
