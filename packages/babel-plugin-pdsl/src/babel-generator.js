// This generator unlike the one in PDSL actually generates babel AST

const {
  isPredicateLookup,
  isVaradicFunction,
  isOperator,
  isLiteral
} = require("pdsl/grammar");

const { literal } = require("./literals");
const { runtimeCreator } = require("./runtime");
const { val, lookupPredicateFunction } = require("./helpers");

function generator(input, babelExpressionList, helpersIdentifier) {
  const [runnable] = input.reduce((stack, node) => {
    if (isPredicateLookup(node)) {
      stack.push(
        lookupPredicateFunction(node, babelExpressionList, helpersIdentifier)
      );
      return stack;
    }

    if (isLiteral(node)) {
      stack.push(literal(node, helpersIdentifier));
      return stack;
    }

    if (isOperator(node) || isVaradicFunction(node)) {
      const { arity } = node;
      const args = stack.splice(-1 * arity);
      const runtime = runtimeCreator(node, helpersIdentifier);
      stack.push(runtime(...args));
      return stack;
    }
  }, []);

  return val(runnable, helpersIdentifier);
}

module.exports = { generator };
