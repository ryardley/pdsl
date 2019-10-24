const { grammar, tokens, isBooleanable } = require("./grammar");

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
    .map(toNode)
    .map((token, index, arr) => {
      // Can the following be done on the parser level?

      // Find a not operator
      if (token.token !== "!" || token.type !== "Operator") {
        return token;
      }

      // if next token is not a booleanable thing this is meant to be the falsey operator
      const nextToken = arr[index + 1];

      if (isBooleanable(nextToken)) {
        return token;
      }

      return grammar[tokens.FALSY_KEYWORD]();
    });
}

module.exports = { lexer };
