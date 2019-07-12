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

describe("value predicates", () => {
  it("should return strict equality with any value", () => {
    expect(p`${true}`(true)).toBe(true);
    expect(p`${false}`(false)).toBe(true);
    expect(p`${false}`(true)).toBe(false);
    expect(p`${null}`(true)).toBe(false);
    expect(p`${null}`(null)).toBe(true);
    expect(p`${undefined}`(undefined)).toBe(true);
    expect(p`${undefined}`(null)).toBe(false);
    expect(p`${null}`(undefined)).toBe(false);
    expect(p`${0}`(0)).toBe(true);
    expect(p`${0}`(1)).toBe(false);
    expect(p`${"Rupert"}`("Rupert")).toBe(true);
  });
});

describe("function predicates", () => {
  it("should use the given function ", () => {
    expect(p`${n => n > 6 && n < 9}`(7)).toBe(true);
    expect(p`${n => n > 6 && n < 9}`(6)).toBe(false);
  });
});

describe("RegEx predicates", () => {
  it("should use the regex as a predicate", () => {
    expect(p`${/^foo/}`("food")).toBe(true);
    expect(p`${/^foo/}`("drink")).toBe(false);
  });
});

describe("Javascript Primitives", () => {
  it("should accept primative classes and test typeof associations", () => {
    expect(p`${Number}`(5)).toBe(true);
    expect(p`${String}`(5)).toBe(false);
    expect(p`${Boolean}`(false)).toBe(true);
    expect(p`${String}`("Foo")).toBe(true);
    expect(p`${Symbol}`(Symbol("Foo"))).toBe(true);
    expect(p`${Function}`(() => {})).toBe(true);
    expect(p`${Array}`([1, 2, 3, 4])).toBe(true);
    expect(p`${Array}`(1234)).toBe(false);
    expect(p`${Object}`({ foo: "foo" })).toBe(true);
  });
});

describe("Deep value predicates", () => {
  it("should interperet stuff on the deep value whitelist as being value checked", () => {
    expect(p`${{}}`({})).toBe(true);
    expect(p`${[]}`([])).toBe(true);
    expect(p`${""}`("")).toBe(true);
    expect(p`${{}}`([])).toBe(false);
    expect(p`${[]}`({})).toBe(false);
    expect(p`${""}`([])).toBe(false);
  });
});
