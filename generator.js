const isPredicateLookup = node => {
  return node.type === "PredicateLookup";
};

const lookupPredicateFunction = (node, funcs) => {
  return funcs[node.token];
};

// XXX: dupl
function isLiteral(node) {
  if (!node) return false;
  return (
    { NumericLiteral: 1, StringLiteral: 1, SymbolLiteral: 1 }[node.type] ||
    false
  );
}

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
      const args = stack.splice(-1 * arity).reverse();
      stack.push(runtime(...args));
      return stack;
    }

    return stack;
  }, []);

  return runnable;
}

module.exports = { generator };
