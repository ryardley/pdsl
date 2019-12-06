const t = require("@babel/types");

// return a function that accepts a list of argument nodes
// to be converted to the relevant function call
// this might be able to read the function name from the
// pdslNode.runtime property
function runtimeCreator(pdslNode, helpersIdentifier) {
  return (...babelNodes) => {
    const identifier = pdslNode.runtimeIdentifier;
    return t.callExpression(
      t.memberExpression(
        t.identifier(helpersIdentifier),
        t.identifier(identifier),
        false
      ),
      babelNodes
    );
  };
}

module.exports = { runtimeCreator };
