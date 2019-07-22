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
      "BigInt",
      "String",
      "Function",
      "Object"
    ].indexOf(expression.name) > -1
  );
}

function isDeepVal(expression) {
  return ["{}", "[]", '""'].indexOf(JSON.stringify(expression)) > -1;
}

function isFunction(expression) {
  return typeof expression === "function";
}

const identity = a => a;

module.exports = { identity, isRegEx, isDeepVal, isFunction, isPrimative };
