const {
  isPredicateLookup,
  isVaradicFunction,
  isOperator,
  isLiteral
} = require("../../pdsl/grammar");

const { literal } = require("./literals");
const { runtimeCreator } = require("./runtime");
const { val, lookupPredicateFunction } = require("./helpers");

function generator(input, babelExpressionList) {
  const [runnable] = input.reduce((stack, node) => {
    if (isPredicateLookup(node)) {
      stack.push(lookupPredicateFunction(node, babelExpressionList));
      return stack;
    }

    if (isLiteral(node)) {
      stack.push(literal(node));
      return stack;
    }

    if (isOperator(node) || isVaradicFunction(node)) {
      const { arity } = node;
      const args = stack.splice(-1 * arity);
      const runtime = runtimeCreator(node);
      stack.push(runtime(...args));
      return stack;
    }
  }, []);

  return { ast: val(runnable) };
}

module.exports = { generator };
