const {
  grammar,
  tokens,
  isBooleanable,
  isOperator,
  hasToken
} = require("./grammar");

const rex = new RegExp(`(${Object.values(tokens).join("|")})`, "g");

const grammers = Object.entries(grammar);

function toNode(token) {
  for (let i = 0; i < grammers.length; i++) {
    const [test, createNode] = grammers[i];

    // HACK:  remove lookahed
    //        need to work out a better way to do this
    const testWithoutLookahead = test === tokens.GT ? "\\>" : test;

    const testPassed = new RegExp(`^${testWithoutLookahead}$`).test(token);

    if (testPassed) {
      return createNode(token);
    }
  }
}

function disambiguateNotOperator(node, index, arr) {
  // Find a not operator
  if (!(isOperator(node) && hasToken(node, "!"))) {
    return node;
  }

  // if next node is not a booleanable
  // thing this is meant to be the falsey operator
  const nextNode = arr[index + 1];

  if (isBooleanable(nextNode)) {
    return node;
  }

  return grammar[tokens.FALSY_KEYWORD]();
}

function lexer(input) {
  rex.lastIndex = 0;
  return input
    .replace(/\/\/.*(\n|$)/g, "") // remove comments
    .match(rex)
    .map(toNode)
    .map(disambiguateNotOperator);
}

module.exports = { lexer };
