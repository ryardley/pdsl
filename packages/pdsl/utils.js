function isRegEx(expression) {
  return expression instanceof RegExp;
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
function astToString(ast) {
  return ast.map(a => a.toString()).join("·");
}

function debug(output, stack, node, type, msg) {
  console.log(
    [
      `token: ${node.token}`,
      `type: ${type}`,
      ...msg.map(m => ` msg:${m}`),
      `stack: ${astToString(stack)}`,
      `output: ${astToString(output)}`
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
  astToString,
  isRegEx,
  isDeepVal,
  isFunction,
  isPrimative
};
