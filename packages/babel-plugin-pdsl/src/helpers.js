const t = require("@babel/types");

// return a babelNode that wraps the babelNode in a val()
// helper function call
function val(babelNode, helpersIdentifier) {
  return t.callExpression(
    t.memberExpression(
      t.identifier(helpersIdentifier),
      t.identifier("val"),
      false
    ),
    [babelNode]
  );
}

// Use Babel API to wrap the babel Node in a helper `pred` function,
function wrapPred(babelNode, helpersIdentifier) {
  return t.callExpression(
    t.memberExpression(
      t.identifier(helpersIdentifier),
      t.identifier("pred"),
      false
    ),
    [babelNode]
  );
}

const lookupPredicateFunction = (node, funcs, helpersIdentifier) => {
  return wrapPred(funcs[node.token], helpersIdentifier);
};
module.exports = { val, lookupPredicateFunction };
