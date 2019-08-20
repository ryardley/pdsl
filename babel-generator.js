const { val } = require("./helpers");
const {
  isPredicateLookup,
  isVaradicFunction,
  isOperator,
  isLiteral
} = require("./grammar");

const lookupPredicateFunction = (node, funcs) => {
  return funcs[node.token];
};

function generator(input, funcs) {
  const [runnable] = input.reduce((stack, node) => {
    if (isPredicateLookup(node)) {
      stack.push(lookupPredicateFunction(node, funcs));
      return stack;
    }

    if (isLiteral(node)) {
      stack.push(node.token);
      return stack;
    }

    if (isOperator(node) || isVaradicFunction(node)) {
      const { arity, runtime } = node;
      const args = stack.splice(-1 * arity);
      stack.push(runtime(...args));
      return stack;
    }
  }, []);

  return val(runnable);
}

module.exports = { generator };
