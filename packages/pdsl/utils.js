function isRegEx(expression) {
  return expression instanceof RegExp;
}

function isPDSLSchema(expression) {
  return expression && typeof expression.unsafe_predicate === "function";
}

function isPrimative(expression) {
  return (
    [
      "Array",
      "Boolean",
      "Number",
      "Symbol",
      // "BigInt", // waiting for stage 4
      "String",
      "Function",
      "Object"
    ].indexOf(expression.name) > -1
  );
}
function rpnToString(rpn) {
  return rpn.map(a => a.toString()).join("·");
}

function debug(output, stack, node, type, msg) {
  console.log(
    [
      `token: ${node.token}`,
      `type: ${type}`,
      ...msg.map(m => ` msg:${m}`),
      `stack: ${rpnToString(stack)}`,
      `output: ${rpnToString(output)}`
    ].join("\n")
  );
}

function isDeepVal(expression) {
  return ["{}", "[]", '""'].indexOf(JSON.stringify(expression)) > -1;
}

function isFunction(expression) {
  return typeof expression === "function";
}

const identity = a => a;

module.exports = {
  debug,
  identity,
  rpnToString,
  isRegEx,
  isDeepVal,
  isFunction,
  isPrimative,
  isPDSLSchema
};

// 3.5.11
