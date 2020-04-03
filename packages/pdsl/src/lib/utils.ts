export function isRegEx(expression) {
  return expression instanceof RegExp;
}

export function isPDSLSchema(expression) {
  return expression && typeof expression.unsafe_predicate === "function";
}

export function isPrimative(expression) {
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
export function rpnToString(rpn) {
  return rpn.map(a => a.toString()).join("·");
}

export function debug(output, stack, node, type, msg) {
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

export function isDeepVal(expression) {
  return ["{}", "[]", '""'].indexOf(JSON.stringify(expression)) > -1;
}

export function isFunction(expression) {
  return typeof expression === "function";
}

export const identity = a => a;

// 3.5.11
