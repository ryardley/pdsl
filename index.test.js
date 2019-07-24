const p = require("./index");
const { Email, gt } = require("./helpers");

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
      email: ${Email} && { length: > 5 },
      arr: ![6],
      foo: !true,
      num: -4 < < 100,
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

  expect(p`${String} && { length: ${6} }`("123456")).toBe(true);
  expect(p`${String} && { length: ${7} }`("123456")).toBe(false);
});

it("should handle complex objects", () => {
  expect(
    p`${String} || {
    username: ${String},
    password: ${String} && {
      length: ${gt(3)}
    }
  }`({ username: "hello", password: "mike" })
  ).toBe(true);
});

it("should handle greater than ", () => {
  expect(p`>5`(6)).toBe(true);
  expect(p`>5`(5)).toBe(false);
  expect(p`{age:>5}`({ age: 34 })).toBe(true);
});

it("should handle greater than equals ", () => {
  expect(p`>=5`(6)).toBe(true);
  expect(p`>=5`(5)).toBe(true);
  expect(p`>=5`(4)).toBe(false);
  expect(p`{age:>=5}`({ age: 34 })).toBe(true);
});

it("should handle less than ", () => {
  expect(p`<5`(4)).toBe(true);
  expect(p`<5`(5)).toBe(false);
  expect(p`{age : < 5}`({ age: 4 })).toBe(true);
});

it("should handle between ", () => {
  expect(p`10 < < 100`(15)).toBe(true);
  expect(p`-10 < < 10`(0)).toBe(true);
  expect(p`-10 < < 10`(-20)).toBe(false);
  expect(p`{age :1 < < 5}`({ age: 4 })).toBe(true);
});
it("should know when to turn a value into a predicate", () => {
  expect(p`10`(10)).toBe(true);
  expect(p`!10`(9)).toBe(true);
  expect(p`true`(true)).toBe(true);
  expect(p`!true && 6`(6)).toBe(true);
  expect(p`"Rudi"`("Rudi")).toBe(true);
  expect(p`{foo:>=10}`({ foo: 10 })).toBe(true);
  expect(p`{foo:!10}`({ foo: "hello" })).toBe(true);
  expect(p`{foo}`({ foo: "hello" })).toBe(true);
});

it("should support the holds function", () => {
  expect(p`[4]`([4])).toBe(true);
  expect(p`[4]`([])).toBe(false);
  expect(p`[4]`([1, 2, 3])).toBe(false);
  expect(p`[4]`([1, 2, 3, 4])).toBe(true);
  expect(p`[4,{name}]`([{ name: "foo" }, 1, 2, 3, 4])).toBe(true);
});

it("should support Email", () => {
  expect(p`Email`("as@as.com")).toBe(true);
  expect(p`Email`("Rudi")).toBe(false);
});

it("should support Number", () => {
  expect(p`Number`("as@as.com")).toBe(false);
  expect(p`Number`(4)).toBe(true);
  expect(p`Number`(0)).toBe(true);
  expect(p`Number`("4")).toBe(false);
  expect(p`Number`(NaN)).toBe(true);
  expect(p`Number`(123.123)).toBe(true);
});

it("should support Array", () => {
  expect(p`Array`("as@as.com")).toBe(false);
  expect(p`Array`([4])).toBe(true);
  expect(p`Array`("4")).toBe(false);
});

it("should support String", () => {
  expect(p`String`("as@as.com")).toBe(true);
  expect(p`String`({ foo: "asd" })).toBe(false);
  expect(p`String`(4)).toBe(false);
  expect(p`String && {length: > 3}`("Hi")).toBe(false);
  expect(p`String && {length: > 3}`("Hello")).toBe(true);
});

it("should support Object", () => {
  expect(p`Object`("as@as.com")).toBe(false);
  expect(p`Object`({ foo: "asd" })).toBe(true);
  expect(p`Object`(4)).toBe(false);
});

it("should support null and undefined", () => {
  expect(p`undefined`(undefined)).toBe(true);
  expect(p`undefined`(0)).toBe(false);
  expect(p`null`(undefined)).toBe(false);
  expect(p`null`(null)).toBe(true);
  expect(p`null`(0)).toBe(false);
  expect(p`null || undefined`(null)).toBe(true);
  expect(p`null || undefined`(false)).toBe(false);
  expect(p`!(null||undefined)`(undefined)).toBe(false);
  expect(p`!(null||undefined)`("")).toBe(true);
  expect(p`!(null||undefined)`("Hi")).toBe(true);
});

it("should handle emptys", () => {
  expect(p`""`("")).toBe(true);
  expect(p`{}`({})).toBe(true);
  expect(p`[]`([])).toBe(true);
  expect(p`[]`([1])).toBe(false);
});

it("should handle a user credentials object", () => {
  const isOnlyLowerCase = p`String & !Nc & !Uc`;
  const hasExtendedChars = p`String & Xc`;

  const isValidUser = p`{
    username: ${isOnlyLowerCase} && {length: 5 < < 9 },
    password: ${hasExtendedChars} && {length: > 8},
    age: > 17
  }`;

  expect(
    isValidUser({ username: "ryardley", password: "Hello1234!", age: 21 })
  ).toBe(true);
  expect(
    isValidUser({ username: "ryardley", password: "Hello1234!", age: 17 })
  ).toBe(false);
  expect(
    isValidUser({ username: "Ryardley", password: "Hello1234!", age: 21 })
  ).toBe(false);
  expect(
    isValidUser({ username: "123456", password: "Hello1234!", age: 21 })
  ).toBe(false);
  expect(
    isValidUser({ username: "ryardley", password: "12345678", age: 21 })
  ).toBe(false);
});

it("should handle roughly PI", () => {
  expect(p`3.1415 < < 3.1416`(Math.PI)).toBe(true);
  expect(p`3.1415 < < 3.1416`(3.1417)).toBe(false);
});

it("should notNil", () => {
  const notNil = p`!(null | undefined)`;

  expect(notNil("something")).toBe(true);
  expect(notNil(false)).toBe(true);
  expect(notNil(0)).toBe(true);
  expect(notNil(null)).toBe(false);
  expect(notNil(undefined)).toBe(false);
});

it("should handle comments", () => {
  const isValidUser = p`{
    username: String, // foo
    // thing
    password: String 
  }`;
  expect(
    isValidUser({ username: "ryardley", password: "Hello1234!", age: 21 })
  ).toBe(true);
});

it("should handle trailing commas", () => {
  const isValidUser = p`{
    username: String,
    password: String,
  }`;
  expect(
    isValidUser({ username: "ryardley", password: "Hello1234!", age: 21 })
  ).toBe(true);
});

it("should deal with garbage input", () => {
  expect(() => {
    p`}{asdjklh askasd h*&%^6 `;
  }).toThrow("Malformed Input");
});

it("should handle .. operator", () => {
  expect(p`1..10`(7)).toBe(true);
  expect(p`1..10`(1)).toBe(true);
  expect(p`1..10`(10)).toBe(true);
  expect(p`1..10`(11)).toBe(false);
});
