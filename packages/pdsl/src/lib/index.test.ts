import p, {
  unsafe_rpn,
  unsafe_tokens,
  predicate,
  configureSchema,
  schema
} from "./index";
import * as helpers from "../helpers/index";
import { ValidationError } from "./errors";
const { Email, gt } = helpers;

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
  it("should accept primative value definitions and test typeof associations", () => {
    expect(p`number`(5)).toBe(true);
    expect(p`string`(5)).toBe(false);
    expect(p`boolean`(false)).toBe(true);
    expect(p`string`("Foo")).toBe(true);
    expect(p`symbol`(Symbol("Foo"))).toBe(true);
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

it("should have an extant predicate", () => {
  expect(p`_`(true)).toBe(true);
  expect(p`_`(false)).toBe(true);
  expect(p`_`(null)).toBe(false);
  expect(p`_`(undefined)).toBe(false);
  expect(p`_`(NaN)).toBe(true);
  expect(p`!`(null)).toBe(true);
  expect(p`!!`(undefined)).toBe(false);
  expect(p`!`(NaN)).toBe(true);
  expect(p`{ name : _ }`({ name: false })).toBe(true);
  expect(p`{ name : _ }`({ name: undefined })).toBe(false);
  expect(p`{ name : _ }`({ name: null })).toBe(false);
});

it("should use the extant predicate as the default object checking behaviour", () => {
  expect(p`{ name }`({ name: false })).toBe(true);
  expect(p`{ name }`({ name: undefined })).toBe(false);
  expect(p`{ name }`({ name: null })).toBe(false);
});

it("should be loose matching by default", () => {
  expect(p`{ name }`({ name: "Fred", age: 12 })).toBe(true);
  expect(p`{ name }`({ name: "Fred", age: 12 })).toBe(true);
  expect(p`{ name, age }`({ name: "Fred", age: 12 })).toBe(true);
});

it("should use exact matching", () => {
  expect(p`{| name |}`({ name: "Fred" })).toBe(true);
  expect(p`{| name |}`({ name: "Fred", age: 12 })).toBe(false);
  expect(p`{| name, age |}`({ name: "Fred", age: 12 })).toBe(true);
});

it("should match exactly all the way down the object tree unless you use a rest", () => {
  expect(
    p`{| name, age, sub: { num: 100 } |}`({
      name: "Fred",
      age: 12,
      sub: { num: 100 }
    })
  ).toBe(true);
  expect(
    p`{| name, age, sub: { num: 100 } |}`({
      name: "Fred",
      age: 12,
      sub: { num: 100, foo: "foo" }
    })
  ).toBe(false);
  expect(
    p`{| name, age, sub: { num: 100, ... } |}`({
      name: "Fred",
      age: 12,
      sub: { num: 100, foo: "foo" }
    })
  ).toBe(true);
  expect(
    p`{| name, age, sub: { num: 100, foo: { strict: true }, ... } |}`({
      name: "Fred",
      age: 12,
      sub: {
        num: 100,
        foo: { strict: true, other: "stuff" },
        bar: "bar"
      }
    })
  ).toBe(false);
  expect(
    p`{| name, age, sub: { num: 100, foo: { strict: true }, ... } |}`({
      name: "Fred",
      age: 12,
      sub: {
        num: 100,
        foo: { strict: true },
        bar: "bar"
      }
    })
  ).toBe(true);

  expect(
    p`{| name, age, sub: [{ num: 100, foo: { strict: true }, ... }] |}`({
      name: "Fred",
      age: 12,
      sub: [
        {
          num: 100,
          foo: { strict: true },
          bar: "bar"
        }
      ]
    })
  ).toBe(true);
});

it("should throw when mismatching strict object syntax", () => {
  expect(() => {
    p`{| name }`;
  }).toThrow();

  expect(() => {
    p`{| name: [ "foo" |} `;
  }).toThrow();

  expect(() => {
    p`{| name `;
  }).toThrow();
});

it("should be able to use nested object property templates", () => {
  expect(
    p`{ meta: { remote }, ...}`({ type: "shared.foo", meta: { remote: true } })
  ).toBe(true);
  expect(
    p`{ meta: !{ remote }, ...}`({ type: "shared.foo", meta: { thing: "foo" } })
  ).toBe(true);
  expect(
    p`{ meta: !{ remote }, ...}`({
      type: "shared.foo",
      meta: { remote: "thing" }
    })
  ).toBe(false);
  expect(
    p`{ meta: !{ remote }, ...}`({
      type: "shared.foo",
      meta: { remote: false }
    })
  ).toBe(false);
  expect(
    p`{ meta: { remote:${false} }, ...}`({
      type: "shared.foo",
      meta: { remote: false }
    })
  ).toBe(true);
});

it("should match the examples", () => {
  expect(p`{length: ${5}, ...}`("12345")).toBe(true);
  expect(p`{length: ${gt(5)}, ...}`("123456")).toBe(true);
  expect(p`{foo:{length:${5}, ...}}`({ foo: "12345" })).toBe(true);
  expect(p`{foo:{length:${gt(5)}, ...}}`({ foo: "123456" })).toBe(true);
  expect(
    p`
  {
    type: ${/^.+foo$/},
    payload: {
      email: ${Email} && { length: > 5, ... },
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

  expect(p`${String} && { length: ${6}, ... }`("123456")).toBe(true);
  expect(p`${String} && { length: ${7}, ... }`("123456")).toBe(false);
});

it("should be able to debug the rpn", () => {
  expect(
    unsafe_tokens`
  {
    type: ${/^.+foo$/},
    payload: {
      email: (${Email} && { length: > 5 }),
      arr: ![6],
      foo: !true,
      num: -4 < < 100,
      bar: {
        baz: ${/^foo/},
        foo
      }
    }
  }`
  ).toBe(
    "{0 type : @{LINK:0} , payload : {0 email : ( @{LINK:1} && {0 length : > 5 } ) , arr : !1 [0 6 ] , foo : !1 true , num : -4 < < 100 , bar : {0 baz : @{LINK:2} , foo } } }"
  );
  expect(
    unsafe_rpn`
  {
    type: ${/^.+foo$/},
    payload: {
      email: (${Email} && { length: > 5 }),
      arr: ![6],
      foo: !true,
      num: -4 < < 100,
      bar: {
        baz: ${/^foo/},
        foo
      }
    }
  }`
  ).toBe(
    "type @{LINK:0} : payload email @{LINK:1} length 5 > : {1 && : arr 6 [1 !1 : foo true !1 : num -4 100 < < : bar baz @{LINK:2} : foo {2 : {5 : {2"
  );
});

it("should test the toString() calls for code coverage", () => {
  expect(
    unsafe_tokens`
    [1..4] |
    'foo' |
    Function |
    Symbol |
    String |
    Boolean |
    array |
    string |
    symbol |
    boolean |
    number |
    undefined |
    null |
    Array |
    Object |
    Number |
    '' |
    "" |
    [] |
    {} |
    LUc |
    Uc |
    Lc |
    Nc |
    Xc |
    Email |
    false |
    true |
    ! 3 |
    ! |
    !! |
    >= 2 |
    <= 2 |
    < 2 |
    _ |
    ... |
    Array< |
    string[ |
    array[ |
    [? |`
  ).toBe(
    [
      "[0 1 .. 4 ]",
      "'foo'",
      "Function",
      "Symbol",
      "String",
      "Boolean",
      "array",
      "string",
      "symbol",
      "boolean",
      "number",
      "undefined",
      "null",
      "Array",
      "Object",
      "Number",
      '""',
      '""',
      "[]",
      "{}",
      "LUc",
      "Uc",
      "Lc",
      "Nc",
      "Xc",
      "Email",
      "false",
      "true",
      "!1 3",
      "!",
      "!!",
      ">= 2",
      "<= 2",
      "< 2",
      "_",
      "...",
      "Array<",
      "string[",
      "array[",
      "[?0"
    ].join(" | ") + " |"
  );
});

it("should handle complex objects", () => {
  expect(
    p`string || {
    username: string,
    password: string && {
      length: > 3, ...
    }
  }`({ username: "hello", password: "mike" })
  ).toBe(true);
});

it("should handle greater than ", () => {
  expect(p`>5`(6)).toBe(true);
  expect(p`>5`(5)).toBe(false);
  expect(p`{age:>5}`({ age: 34 })).toBe(true);
});

it("should handle a wildcard", () => {
  expect(p`*`()).toBe(true);
  expect(p`*`("Foo")).toBe(true);
  expect(p`*`(false)).toBe(true);
  expect(p`*`(undefined)).toBe(true);
  expect(p`*`(null)).toBe(true);
  expect(p`*`(NaN)).toBe(true);
});

it("should respect a wildcard on an object", () => {
  expect(p`{|name: *|}`({ name: undefined })).toBe(true);
  expect(p`{|name: *|}`({ name: null })).toBe(true);
  expect(p`{|name: *|}`({ name: false })).toBe(true);
  expect(p`{|name: *|}`({})).toBe(false);
});

it("should handle greater than equals ", () => {
  expect(p`>=5`(6)).toBe(true);
  expect(p`>=5`(5)).toBe(true);
  expect(p`<=5`(4)).toBe(true);
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

it("should support the array exact matching syntax", () => {
  expect(p`[4]`([4])).toBe(true);
  expect(p`[4]`([])).toBe(false);
  expect(p`[4]`([1, 2, 3])).toBe(false);
  expect(p`[1,2,3,4]`([1, 2, 3, 4])).toBe(true);
  expect(p`[4,{name}]`([{ name: "foo" }, 4])).toBe(false);
  expect(p`[{name}, 4]`([{ name: "foo" }, 4])).toBe(true);
});

it("should support the array loose matching syntax", () => {
  expect(p`[4]`([4])).toBe(true);
  expect(p`[4]`([])).toBe(false);
  expect(p`[4]`([1, 2, 3])).toBe(false);
  expect(p`[1,2,3,4]`([1, 2, 3, 4])).toBe(true);
  expect(p`[4, {name}]`([{ name: "foo" }, 4])).toBe(false);
  expect(p`[{name}, 4]`([{ name: "foo" }, 4])).toBe(true);
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
  expect(p`String && {length: > 3, ...}`("Hi")).toBe(false);
  expect(p`String && {length: > 3, ...}`("Hello")).toBe(true);
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
  expect(p`!(null|undefined)`(undefined)).toBe(false);
  expect(p`!(null|undefined)`("")).toBe(true);
  expect(p`!(null|undefined)`("Hi")).toBe(true);
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
    username: ${isOnlyLowerCase} && {length: 5 < < 9, ... },
    password: ${hasExtendedChars} && {length: > 8, ...},
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
    password: String, ...
  }`;
  expect(
    isValidUser({ username: "ryardley", password: "Hello1234!", age: 21 })
  ).toBe(true);
});

it("should handle trailing commas", () => {
  const isValidUser = p`{
    username: String,
    password: String, ...,
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

it("should handle all the symbols", () => {
  expect(p`true`(true)).toBe(true);
  expect(p`false`(false)).toBe(true);
  expect(p`""`("")).toBe(true);
  expect(p`''`("")).toBe(true);
  expect(p`Boolean`(false)).toBe(true);
  expect(p`Boolean`(0)).toBe(false);
  expect(p`Symbol`(Symbol("hello"))).toBe(true);
  expect(p`Symbol`("hello")).toBe(false);
  expect(p`Function`(() => {})).toBe(true);
  expect(p`'A single string'`("A single string")).toBe(true);

  // TODO: These will be deprecated
  expect(p`Lc`("abcdef")).toBe(true);
  expect(p`Lc`("ABCDEF")).toBe(false);
  expect(p`Lc`("aBCDEF")).toBe(true);
  expect(p`LUc`("ABCDEF")).toBe(false);
  expect(p`LUc`("AbCDEF")).toBe(true);
  expect(p`LUc`("abcdef")).toBe(false);
});

it("should handle strings with weird characters", () => {
  expect(
    p`"This string contains \`backticks\`"`("This string contains `backticks`")
  ).toBe(true);

  expect(
    p`"This string contains 'single quotes'"`(
      "This string contains 'single quotes'"
    )
  ).toBe(true);
});

it("should be able to use a truthy operator", () => {
  expect(p`!`(true)).toBe(false);
  expect(p`!`(false)).toBe(true);
  expect(p`!!`(true)).toBe(true);
  expect(p`!!`(false)).toBe(false);
  expect(p`{name: !}`({ name: 1 })).toBe(false);
  expect(p`{name: !}`({ name: 0 })).toBe(true);
});

it("should only match exact array values", () => {
  expect(
    p`["one", number, {name: string}]`(["one", 123, { name: "a name" }])
  ).toBe(true);

  expect(
    p`["one", number, {name: string}]`(["one", 123, { name: "a name" }, 1234])
  ).toBe(false);

  expect(
    p`[ {name:string}, number , * ]`([{ name: "Foo" }, 1, undefined])
  ).toBe(true);
});

it("should match array values with greedy wildcard", () => {
  expect(
    p`[number, number, string, ...]`([1, 2, "3", "four", undefined, undefined])
  ).toBe(true);
});

it("should be able to match array includes syntax", () => {
  expect(p`[? "four"]`([1, 2, "3", "four", undefined, undefined])).toBe(true);
  expect(p`[? "four"]`([1, 2, "3", undefined, undefined])).toBe(false);
  expect(p`[? "four", "3"]`([1, 2, "3", undefined, undefined])).toBe(false);
  expect(p`[?1,"3"]`([1, 2, "3", undefined, undefined])).toBe(true);
  expect(p`[? 5]`([1, 2, 3, 4, 5])).toBe(true);
  expect(p`[? 5]`([1, 2, 3, 4])).toBe(false);
  expect(p`[? 5 | "5"]`([1, 2, 3, 4, "5"])).toBe(true);
  expect(p`[? 5 | "5"]`([1, 2, 3, 4, 50])).toBe(false);
  expect(p`[? > 5]`([1, 2, 3, 4, 50])).toBe(true);
  expect(p`[? > 5]`([1, 2, 3, 4])).toBe(false);
});

it("should match Array<type> syntax", () => {
  expect(p`Array<number>`([1, 2, 3, 4, 5])).toBe(true);
  expect(p`Array<number>`([1, 2, 3, 4, "5"])).toBe(false);
  expect(p`Array<{name:string}>`([{ name: "foo" }])).toBe(true);
  expect(p`Array<{name:string|number}>`([{ name: "foo" }, { name: 3 }])).toBe(
    true
  );
  expect(p`{property: Array<number>}`({ property: [1] })).toBe(true);
  expect(p`{property: Array<>6>}`({ property: [7, 8, 9] })).toBe(true);
  expect(p`{property: Array<>6>}`({ property: [1, 8, 9] })).toBe(false);
  expect(p`Array<{name}>`([{ name: "Rudi" }])).toBe(true);
  expect(p`Array<{name}>`([{ name: undefined }])).toBe(false);
  expect(p`Array<{name}>`({ name: undefined })).toBe(false);
  expect(p`Array<{name}> & {length:4, ...}`([{ name: "Rudi" }])).toBe(false);
  expect(p`Array<{name}> & {length:1, ...}`([{ name: "Rudi" }])).toBe(true);
});

it("should support string length syntax", () => {
  expect(p`string[4]`("1")).toBe(false);
  expect(p`string[4]`("1234")).toBe(true);
  expect(p`string[4]`("12345")).toBe(false);
  expect(p`string[>4]`("12345")).toBe(true);
  expect(p`string[>4]`("1234")).toBe(false);
  expect(p`string[${4}]`("1234")).toBe(true);
  expect(p`string[4..6]`("123")).toBe(false);
  expect(p`string[4..6]`("1234")).toBe(true);
  expect(p`string[4..6]`("123456")).toBe(true);
  expect(p`string[4..6]`("1234567")).toBe(false);
  expect(p`{password: string[>10]}`({ password: "abcdefghijk" })).toBe(true);
});

it("should support array length syntax", () => {
  expect(p`array[4]`([1])).toBe(false);
  expect(p`array[4]`([1, 2, 3, 4])).toBe(true);
  expect(p`Array<number> & array[5]`([1, 2, 3, 4, 5])).toBe(true);
  expect(p`array[>4]`([1, 2, 3, 4, 5])).toBe(true);
  expect(p`array[5] & Array<number> & [_,_,3, ...]`([1, 2, 3, 4, 5])).toBe(
    true
  );
  expect(p`array[5] & Array<number> & [_,*,3]`([1, 2, 3, 4, 5])).toBe(false);
});

it("should parse logic in numeric value calulations", () => {
  expect(p`>5`(6)).toBe(true);
  expect(p`> 5 & < 10`(6)).toBe(true);
  expect(p`5..7 | 10..13`(6)).toBe(true);
});

it("should handle nested properties starting with underscores", () => {
  expect(
    p`{
  action:{
    _typename: "Redirect" 
  }
}`({
      action: { _typename: "Redirect" }
    })
  ).toBe(true);
});

it("should be able to pass a config object in", () => {
  expect(predicate({})`>5`(6)).toBe(true);
  expect(predicate({})`>5`(5)).toBe(false);
});

describe("validation", () => {
  const pdsl = configureSchema({
    throwErrors: false
  });

  it("should be able to use var substitution in error messages", () => {
    const expression = pdsl`>5 <- "Value $1 must be greater than 5!"`;
    expect(expression.unsafe_rpn()).toBe("5 > :e:Val:");
    expect(expression.validateSync(4)).toEqual([
      { path: "", message: "Value 4 must be greater than 5!" }
    ]);
  });

  it("should be handle when var substitution is out of bounds", () => {
    const expression = pdsl`>5 <- "Value $7 must be greater than 5!"`;
    expect(expression.unsafe_rpn()).toBe("5 > :e:Val:");
    expect(expression.validateSync(4)).toEqual([
      { path: "", message: "Value undefined must be greater than 5!" }
    ]);
  });

  it("should be able to accept whitespace", () => {
    const expression = pdsl`>5 <-     "Value must be greater than 5!   "`;
    expect(expression.unsafe_rpn()).toBe("5 > :e:Val:");
    expect(expression.validateSync(4)).toEqual([
      { path: "", message: "Value must be greater than 5!" }
    ]);
  });

  it("should work on object properties", () => {
    const expression = pdsl`{
      name: string <- "Name is not a string!",
      age: number <- "Age is not a number!"
    }`;

    expect(expression.validateSync({ name: 1234, age: "12342134" })).toEqual([
      {
        message: "Name is not a string!",
        path: "name"
      },
      {
        message: "Age is not a number!",
        path: "age"
      }
    ]);
  });

  it("should work on arrays", () => {
    const expression = pdsl`[1,2,3] <- "Array is not [1,2,3]"`;
    expect(expression.validateSync([1, 2, 3, 4])).toEqual([
      { path: "", message: "Array is not [1,2,3]" }
    ]);
    expect(expression.validateSync([1, 2, 3])).toEqual([]);
  });

  it("should handle precedence and cling to whatever is before it", () => {
    const expression = pdsl`{
      name: string               <- "Name must be a string"
      & string[>7]               <- "Name must be longer than 7 characters",
      age: (number & > 18)       <- "Age must be numeric and over 18"
    }`;

    expect(expression.validateSync({ name: "12345678", age: 20 })).toEqual([]);

    expect(expression.validateSync({ name: "123456", age: 20 })).toEqual([
      {
        message: "Name must be longer than 7 characters",
        path: "name"
      }
    ]);
    expect(expression.validateSync({ name: "12345", age: 17 })).toEqual([
      {
        message: "Name must be longer than 7 characters",
        path: "name"
      },
      {
        message: "Age must be numeric and over 18",
        path: "age"
      }
    ]);

    expect(expression.validateSync({ name: "12345678", age: 16 })).toEqual([
      {
        message: "Age must be numeric and over 18",
        path: "age"
      }
    ]);
  });

  it("should throw the right errors", () => {
    const expression = schema`{
      name: string               <- "Name must be a string"
      & string[>7]               <- "Name must be longer than 7 characters",
      age: (number & > 18)       <- "Age must be numeric and over 18"
    }`.validateSync;

    try {
      expression({ name: "Foo", age: 20 });
    } catch (err) {
      expect(
        p`{
          path: "name", 
          message: "Name must be longer than 7 characters"
        }`(err.inner[0])
      ).toBe(true);
    }

    try {
      expression({ name: 123, age: 20 });
    } catch (err) {
      expect(
        p`{
          path: "name", 
          message: "Name must be a string"
        }`(err.inner[0])
      ).toBe(true);
    }
  });

  it("should skip over all errors from OR decisions", () => {
    const expression = pdsl`({
      name: string               <- "Name must be a string"
    } | {
      age: (number & > 18)       <- "Age must be numeric and over 18"
    }) <- "You are not verified"`;
    expect(expression.validateSync({ name: 100 })).toEqual([
      { path: "name", message: "Name must be a string" },
      { path: "age", message: "Age must be numeric and over 18" },
      { path: "", message: "You are not verified" }
    ]);
    expect(expression.validateSync({ name: "100" })).toEqual([]);
    expect(expression.validateSync({ age: 100 })).toEqual([]);

    expect(expression.validateSync({ foo: "bar" })).toEqual([
      { path: "name", message: "Name must be a string" },
      { path: "age", message: "Age must be numeric and over 18" },
      { path: "", message: "You are not verified" }
    ]);
  });

  it("should work with literal strings", () => {
    const expression = pdsl`"hello" <- "This should be hello"`;
    expect(expression.unsafe_rpn()).toBe('"hello" :e:Thi:');
    expect(expression.validateSync("nope")).toEqual([
      { path: "", message: "This should be hello" }
    ]);
  });

  it("should work with escaped quotes", () => {
    // Unfortunately because of the way template strings work we
    // have to use double backslash to escape quotes :(
    const expression = pdsl`"hello" <- "This \\"should\\" be hello"`;

    expect(expression.validateSync("nope")).toEqual([
      { path: "", message: 'This "should" be hello' }
    ]);
  });

  it("should work with nested objects", () => {
    const expression = pdsl`{
      name: string               <- "Name must be a string",
      age: (number & > 18)       <- "Age must be numeric and over 18",
      school: {
        type: "summer"           <- "Summer must be type",
        thing: "winter"          <- "Winter must be thing"
      }                          <- "School object problems"                         
    }`;

    expect(
      expression.validateSync({
        name: "rudi",
        age: 123,
        school: { type: "foo" }
      })
    ).toEqual([
      { path: "school.type", message: "Summer must be type" },
      { path: "school.thing", message: "Winter must be thing" },
      { path: "school", message: "School object problems" }
    ]);
  });

  it("should work with typed arrays", () => {
    const expression = pdsl`Array<number>`;

    expect(expression.validateSync(["a", "b"])).toEqual([
      {
        message: 'Value "a" is not of type "Number"',
        path: ""
      },
      {
        message: 'Array ["a","b"] does not match given type',
        path: ""
      }
    ]);
  });

  it("should validate object shorthands", () => {
    const expression = pdsl`{
      name <- "Name is not provided!",
    }`;
    expect(expression.validateSync({ name: undefined })).toEqual([
      {
        message: "Name is not provided!",
        path: "name"
      }
    ]);
  });

  it("should validate asynchronously", async () => {
    const expression = pdsl`{
      name: string <- "Name is not a string!",
      age: number <- "Age is not a number!"
    }`;

    expect(await expression.validate({ name: "Fred", age: "16" })).toEqual([
      {
        message: "Age is not a number!",
        path: "age"
      }
    ]);
  });

  it("should throw errors that can be parsed by formik", async () => {
    const schema = configureSchema({ throwErrors: true })`{
      name: string <- "Name is not a string!",
      age: number <- "Age is not a number!",
      thing: _ <- "Thing is not null or undefined"
    }`;

    expect(schema.unsafe_rpn()).toBe(
      "name string :e:Nam: : age number :e:Age: : thing _ :e:Thi: : {3"
    );

    let myerror;

    try {
      await schema.validate({ name: 1234, age: "16", thing: undefined });
    } catch (err) {
      myerror = err;
    }

    expect(myerror.name).toBe("ValidationError");
    expect(myerror.inner).toEqual([
      {
        message: "Name is not a string!",
        path: "name"
      },
      {
        message: "Age is not a number!",
        path: "age"
      },
      {
        message: "Thing is not null or undefined",
        path: "thing"
      }
    ]);
  });

  it("should provide reasonable defaults", () => {
    const expression = pdsl`{
      name: string,
      age: number & > 20,
      thing: _
    }`;

    expect(expression.validateSync({})).toEqual([
      {
        message: 'Value undefined is not of type "String"',
        path: "name"
      },
      {
        message: 'Value undefined is not of type "Number"',
        path: "age"
      },
      {
        message: "Value undefined is either null or undefined",
        path: "thing"
      }
    ]);
  });

  it("should not have an inner property if there is only one error", async () => {
    const expression = configureSchema({ throwErrors: true })`{
      name: string <- "Name is not a string!",
      age: number <- "Age is not a number!"
    }`;

    let myerror;

    try {
      await expression.validate({ name: 1234, age: 16 });
    } catch (err) {
      myerror = err;
    }

    expect(myerror.name).toBe("ValidationError");
    expect(myerror.inner[0].message).toBe("Name is not a string!");
    expect(myerror.inner[0].path).toBe("name");
  });

  it("should parse expressions with multiple string length calls", () => {
    expect(
      p`{
      email: 
        _         <- "Required" 
        & Email   <- "Invalid email address",

      firstName: 
        _             <- "Required" 
        & string[>2]  <- "Must be longer than 2 characters"
        & string[<20] <- "Nice try nobody has a first name that long",

      lastName: 
        _             <- "Required" 
        & string[>2]  <- "Must be longer than 2 characters"
        & string[<20] <- "Nice try nobody has a last name that long"
    }`({
        email: "contact@example.com",
        firstName: "Foo",
        lastName: "Barr"
      })
    ).toBe(true);
  });

  describe("schema mode", () => {
    it("should not return a function when using schema mode", async () => {
      const schema = pdsl`"Hello"`;

      expect(typeof schema).toBe("object");
    });

    it("should be able to compose other p expressions", () => {
      const validEmail = p`_ <- "Required" & Email <- "Invalid email address"`;

      const schemaObject = schema`{ email: ${validEmail} }`;

      expect(() => {
        schemaObject.validateSync({ email: "foo@bar.com" });
      }).not.toThrow();
    });

    it("should be able to compose other schemas", () => {
      const validEmail = schema`_ <- "Required" & Email <- "Invalid email address"`;

      const schemaObj = schema`{ 
        email: ${validEmail}
      }`;

      expect(() => {
        schemaObj.validateSync({ email: "foo@bar.com" });
      }).not.toThrow();
    });

    it("should pass a sanity test", async () => {
      const schemaObj = schema`{ greeting: "Hello", object: "World" }`;

      expect(schemaObj.validate).not.toBeUndefined();
      expect(schemaObj.validateSync).not.toBeUndefined();

      let error;
      try {
        await schemaObj.validate("Hello World");
      } catch (err) {
        error = err;
      }

      expect(error.name).toBe("ValidationError");
      expect(error.message).toBe('Value undefined did not match value "Hello"');
      expect(error.path).toBe("greeting");
      expect(error.inner).toEqual([
        {
          message: 'Value undefined did not match value "Hello"',
          path: "greeting"
        },
        {
          message: 'Value undefined did not match value "World"',
          path: "object"
        }
      ]);

      error = undefined;

      try {
        await schemaObj.validate({ greeting: "Hello", object: "World" });
      } catch (err) {
        error = err;
      }

      expect(error).toBeUndefined();
    });

    it("should match a typical object validation schema", async () => {
      const schemaObj = schema`{
        email: Email <- "Invalid email address",
        firstName: string <- "Invalid firstName",
        lastName: string <- "Invalid lastName"
      }`;

      let error: ValidationError;
      try {
        await schemaObj.validate({
          email: "foo",
          firstName: "Rudi",
          lastName: "Yardley"
        });
      } catch (error) {
        expect((error as ValidationError).inner).toEqual([
          {
            message: "Invalid email address",
            path: "email"
          }
        ]);
      }
    });
  });
});

describe("precompiled babel API", () => {
  test("default", () => {
    const pdsl = helpers.createDefault();
    const itWorks = pdsl(_h => _h.val("works!"));

    expect(itWorks("works!")).toBe(true);
    expect(itWorks("nope")).toBe(false);
  });

  test("predicate()", () => {
    const pdsl = helpers.createDefault();
    const itWorks = pdsl.predicate({})(_h => _h.val("works!"));

    expect(itWorks("works!")).toBe(true);
    expect(itWorks("nope")).toBe(false);
  });

  test("schema()", () => {
    const pdsl = helpers.createDefault();
    const itWorks = pdsl.schema(_h => _h.val("works!")).validateSync;

    expect(itWorks("works!")).toEqual([]);

    try {
      itWorks("nope!");
    } catch (error) {
      expect((error as ValidationError).inner[0].message).toEqual(
        'Value "nope!" did not match value "works!"'
      );
    }
  });
});
