const { val } = require("./helpers");
const { isPredicateLookup, isLiteral } = require("./grammar");

const lookupPredicateFunction = (node, funcs) => {
  return funcs[node.token];
};

function isOperator(node) {
  if (!node) return false;
  return (
    {
      VariableArityOperator: 1,
      VariableArityOperatorClose: 1,
      Operator: 1,
      ArgumentSeparator: 1
    }[node.type] || false
  );
}

function generator(input, funcs) {
  // console.log(input);
  const [runnable] = input.reduce((stack, node) => {
    if (isPredicateLookup(node)) {
      stack.push(lookupPredicateFunction(node, funcs));
      return stack;
    }

    if (isLiteral(node)) {
      stack.push(node.token);
      return stack;
    }

    if (isOperator(node)) {
      const { arity, runtime } = node;
      const args = stack.splice(-1 * arity);
      stack.push(runtime(...args));
      return stack;
    }

    return stack;
  }, []);

  return val(runnable);
}

module.exports = { generator };
