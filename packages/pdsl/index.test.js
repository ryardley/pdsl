const p = require("./index");
const { Email, btw, gt, has } = require("./helpers");

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

describe("Javascript primitives", () => {
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

// TODO add more tests
it("should be able to use object template properties", () => {
  expect(p`{name:${"Rudi"}}`({ name: "Rudi" })).toBe(true);
});

it("should be able to use brackets and or in template properties", () => {
  expect(p`{name:(${"Rudi"} || ${"Gregor"})}`({ name: "Rudi" })).toBe(true);
  expect(p`{name:(${"Rudi"} || ${"Gregor"})}`({ name: "Gregor" })).toBe(true);
  expect(p`{name:(${"Rudi"} || ${"Gregor"})}`({ name: "Other" })).toBe(false);
});

it("should be able to use nested object property templates", () => {
  expect(
    p`{ meta: { remote }}`({ type: "shared.foo", meta: { remote: true } })
  ).toBe(true);
  expect(
    p`{ meta: !{ remote }}`({ type: "shared.foo", meta: { thing: "foo" } })
  ).toBe(true);
  expect(
    p`{ meta: !{ remote }}`({ type: "shared.foo", meta: { remote: "thing" } })
  ).toBe(false);
  expect(
    p`{ meta: !{ remote }}`({ type: "shared.foo", meta: { remote: false } })
  ).toBe(true);
  expect(
    p`{ meta: { remote:${false} }}`({
      type: "shared.foo",
      meta: { remote: false }
    })
  ).toBe(true);
});

it("should match the examples", () => {
  expect(p`{length: ${5}}`("12345")).toBe(true);
  expect(p`{length: ${gt(5)}}`("123456")).toBe(true);
  expect(p`{foo:{length:${5}}}`({ foo: "12345" })).toBe(true);
  expect(p`{foo:{length:${gt(5)}}}`({ foo: "123456" })).toBe(true);
  expect(
    p`
  {
    type: ${/^.+foo$/},
    payload: {
      email: ${Email} && { length: ${gt(5)} },
      arr: !${has(6)},
      foo: !${true},
      num: ${btw(-4, 100)},
      bar: {
        baz: ${/^foo/},
        foo
      }
    }
  }`({
      type: "asdsadfoo",
      payload: {
        email: "a@b.com",
        arr: [3, 3, 3, 3, 3],
        foo: false,
        num: 10,
        bar: {
          baz: "food",
          foo: true
        }
      }
    })
  ).toBe(true);

  expect(
    p`${String} || {
    username: ${String}, 
    password: ${String} && { 
      length: ${gt(3)}
    }
  }`({})
  ).toBe(false);

  expect(
    p`${String} || {
    username: ${String}, 
    password: ${String} && { 
      length: ${gt(3)}
    }
  }`({ username: "hello", password: "mi" })
  ).toBe(false);

  expect(
    p`${String} || {
    username: ${String}, 
    password: ${String} && { 
      length: ${gt(3)}
    }
  }`({ username: "hello", password: "mike" })
  ).toBe(true);

  const is6CharString = p`${String} && { length: ${6} }`;

  expect(is6CharString("123456")).toBe(true);
});
