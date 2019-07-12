function valToPredicate(val) {
  return a => a === val;
}

function funToPredicate(fun) {
  return fun;
}

function deepValToPredicate(val) {
  const stVal = JSON.stringify(val);
  return a => stVal === JSON.stringify(a);
}

function regExToPredicate(regEx) {
  return regEx.test.bind(regEx);
}

function primativeToPredicate(primative) {
  if (primative.name === "Array") return a => Array.isArray(a);

  return a => typeof a === primative.name.toLowerCase();
}

function isRegEx(regEx) {
  return regEx instanceof RegExp;
}

function isPrimative(primative) {
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
    ].indexOf(primative.name) > -1
  );
}

function isDeepVal(val) {
  return ["{}", "[]", '""'].indexOf(JSON.stringify(val)) > -1;
}

function isFunction(fun) {
  return typeof fun === "function";
}

function getInputParser(input) {
  if (isFunction(input) && isPrimative(input)) return primativeToPredicate;
  if (isFunction(input) && !isPrimative(input)) return funToPredicate;
  if (isRegEx(input)) return regExToPredicate;
  if (isDeepVal(input)) return deepValToPredicate;
  return valToPredicate;
}

function p(_, input) {
  const parseInput = getInputParser(input);
  return parseInput(input);
}

module.exports = p;
module.exports.default = p;
