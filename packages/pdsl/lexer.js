const {
  grammar,
  tokens,
  isBooleanable,
  isOperator,
  hasToken
} = require("./grammar");

const rexString = `(${Object.values(tokens).join("|")})`;

const rex = new RegExp(rexString, "g");

const grammers = Object.entries(grammar);

function toNode(token) {
  for (let i = 0; i < grammers.length; i++) {
    const [test, createNode] = grammers[i];

    // HACK:  remove lookahead
    //        need to work out a better way to do this
    const testWithoutLookahead = test === tokens.GT ? "\\>" : test;

    const testPassed = new RegExp(`^${testWithoutLookahead}$`).test(token);

    if (testPassed) {
      return createNode(token);
    }
  }
}

// HACK: can we do this using a regex and look ahead?
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

  return grammar[tokens.FALSY_KEYWORD]("!");
}

function lexer(input) {
  rex.lastIndex = 0;
  return (
    input
      // remove comments
      .replace(/\/\/.*(\n|$)/g, "")
      // Remove closing string bracket to make
      // string[x] and array[x] a a unary operator
      // eg. "string[ > 7]" -> "string[ > 7"
      .replace(/((?:string|array)\[)([^\]]*)(\])/, "$1$2")
      // go and globally tokenise everything for parsing
      .match(rex)
      // convert to an object
      .map(toNode)
      .map(disambiguateNotOperator)
  );
}

module.exports = { lexer };
