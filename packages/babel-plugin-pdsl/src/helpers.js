const t = require("@babel/types");

// return a babelNode that wraps the babelNode in a val()
// helper function call
function val(babelNode) {
  return t.callExpression(t.identifier("val"), [babelNode]);
}

// Use Babel API to wrap the babel Node in a helper `pred` function,
function wrapPred(babelNode) {
  return t.callExpression(t.identifier("pred"), [babelNode]);
}

const lookupPredicateFunction = (node, funcs) => {
  return wrapPred(funcs[node.token]);
};
module.exports = { val, lookupPredicateFunction };
