const t = require("@babel/types");

// return a function that accepts a list of argument nodes
// to be converted to the relevant function call
// this might be able to read the function name from the
// pdslNode.runtime property
function runtimeCreator(pdslNode) {
  return (...babelNodes) => {
    const identifier = pdslNode.runtime.name;
    return t.callExpression(t.identifier(identifier), babelNodes);
  };
}

module.exports = { runtimeCreator };
