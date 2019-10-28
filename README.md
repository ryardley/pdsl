<img src="pdsl-logo.png" width="200" />

# Predicate Domain Specific Language

#### An expressive declarative toolkit for composing predicates in TypeScript or JavaScript

```js
import p from "pdsl";

const isSoftwareCreator = p`{
  name: string,
  age: > 16,
  occupation: "Engineer" | "Designer" | "Project Manager"
}`;

isSoftwareCreator(someone); // true | false
```

- [x] Intuitive
- [x] Expressive
- [x] Lightweight
- [x] No dependencies
- [x] Small bundle size
- [x] Fast

<br/>

[![Build Status](https://travis-ci.com/ryardley/pdsl.svg?branch=master)](https://travis-ci.com/ryardley/pdsl)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/pdsl.svg)
![npm](https://img.shields.io/npm/v/pdsl.svg)
[![codecov](https://codecov.io/gh/ryardley/pdsl/branch/master/graph/badge.svg)](https://codecov.io/gh/ryardley/pdsl)

## Predicate functions are just easier with PDSL

Creating predicate functions in JavaScript is often verbose, especially for checking the format of complex object types. We need predicate functions all the time when filtering an array, validating input, determining the type of an unknown object or creating guard conditions in TypeScript.

PDSL provides the developer a simple but powerful shorthand based on a combination of template strings and helper functions for defining predicate functions that makes it easy to understand intent. With `pdsl` we can easily visualize the expected input's structure and intent using it's intuitive predicate composition language.

## Examples

PDSL doesn't really take much learning. Best thing to do is to look at a few examples.

### Quick nil check

_Vanilla JS:_

```js
const extant = input => input !== null && input !== undefined;
```

**PDSL:**

```js
const extant = p`!(null|undefined)`;
```

```js
extant("something"); // true
extant(false); // true
extant(0); // true
extant(null); // false
extant(undefined); // false
```

PDSL is quicker to type, expresses intent and is a fair bit shorter but in PDSL we like things even shorter and this is so common in programming that PDSL now provides an extant predicate:

```js
const extant = p`_`;
```

### Object has non-nullish property

_Vanilla JS:_

```js
const hasName = input =>
  input && input.name !== null && input.name !== undefined;
```

**PDSL:**

```js
const isObjWithName = p`{ name }`;
```

```js
isObjWithName({ name: "A name" }); // true
isObjWithName({ name: true }); // true
isObjWithName({ name: 0 }); // true
isObjWithName({ name: undefined }); // false
isObjWithName({}); // false
```

This would be the same as using:

```js
const isObjWithName = p`{ name: _ }`;
```

#### Exact matching syntax

PDSL is exact matching by default which means the following:

```js
p`{ name }`({ name: "A name", age: 234 }); // false
```

However you can add a rest parameter to fix this:

```js
p`{ name, ... }`({
  name: "A name",
  age: 234,
  occupation: "developer"
}); // true
```

### Array contains exact items

```js
p`[ number, string, *, { type: "SEVEN" } ]`([
  7,
  "seven",
  NaN,
  { type: "SEVEN" }
]); // true
```

### Typed Arrays 

```js
p`Array<number>`([1,2,3,4]);
```

### Number is part of range

_Vanilla JS:_

```js
const isBetween1And10 = input => input >= 1 && input <= 10;
```

**PDSL:**

```js
const isBetween1And10 = p`1..10`;
```

```js
isBetween1And10(1); // true
isBetween1And10(5); // true
isBetween1And10(10); // true
isBetween1And10(11); // false
```

### Input is numeric

_Vanilla JS:_

```js
const isNumeric = input => typeof input === "number";
```

**PDSL:**

```js
const isNumeric = p`number`;
```

```js
p`number`(3.1415); // true
p`number`("123"); // false
```

### Input is an Array with exactly 4 items

_Vanilla JS:_

```js
const is4ItemArray = input => Array.isArray(input) && input.length === 4;
```

**PDSL:**

```js
const is4ItemArray = p`array[4]`;
```

```js
p`array[4]`([1, 2, 3, 4]); // true
p`array[4]`([1, 2, 3, 4, 5]); // false
```

With greater than 4 items:

```js
p`array[>4]`([1, 2, 3, 4, 5]); // true
```

### User validation

You can compose p expressions easily.

```js
const Nums = /[0-9]/;
const UpCase = /[A-Z]/;
const NotNumsAndUpCase = p`!${Nums} & !${UpCase}`;
const Extended = /[^a-zA-Z0-9]/;

const isValidUser = p`{
  username: string[4..8] & ${NotNumsAndUpCase},
  password: string[>8] & ${Extended},
  age: > 17
}`;

isValidUser({ username: "ryardley", password: "Hello1234!", age: 21 }); //true
isValidUser({ username: "ryardley", password: "Hello1234!", age: 17 }); //false
isValidUser({ username: "Ryardley", password: "Hello1234!", age: 21 }); //false
isValidUser({ username: "12345", password: "Hello1234!", age: 21 }); //false
isValidUser({ username: "ryardley", password: "12345678", age: 21 }); //false
```

The more complex things get, the more PDSL shines. See the above example in vanilla JS:

```js
const isValidUser = input =>
  input &&
    input.username &&
    typeof input.username === "string" &&
    !input.username.match(/[^0-9]/) &&
    !input.username.match(/[^A-Z]/) &&
    input.username.length >= 4 &&
    input.username.length <= 8 &&
    typeof input.password === "string" &&
    input.password.match(/[^a-zA-Z0-9]/) &&
    input.password.length > 8 &&
    input.age > 17;
```

### Complex Example

```js
// `pdsl` expressively defines an input value's constraints
import p from "pdsl";

const isKitchenSinc = p`
  {
    type: ${/^.+foo$/},
    payload: {
      email: string[>5] & Email,
      arr: [6,'foo', ...], 
      foo: !true,
      num: 1..10,
      bar: {
        baz: ${/^foo/},
        foo: !!
      }
    }
  }
`;

isKitchenSinc({
  type: "snafoo",
  payload: {
    email: "hello@world.com",
    arr: [6, "foo", 1, 2, 3, 4, 5, 6],
    foo: false,
    num: 2,
    bar: {
      baz: "food",
      foo: "I am truthy"
    }
  }
}); // true
```

## Installation

Install with npm or yarn

```bash
yarn add pdsl
```

```bash
npm install pdsl
```

## Usage

### Primitive matching

If you pass a JavaScript primitive object, you will get the appropriate typeof check.

```js
const isNumeric = p`Number`; // typeof value === 'number'
const isBoolean = p`Boolean`; // typeof value === 'boolean'
const isString = p`String`; // typeof value === 'string'
const isSymbol = p`Symbol`; // typeof value === 'symbol'
const isArray = p`Array`; // Array.isArray(value)
const isObject = p`Object`; // typeof value === 'object'
const isFunction = p`Function`; // typeof value === 'function'
// const isBigInt = p`BigInt`;// BigInt will be coming soon once standardised
```

For consistency with typesystems such as TypeScript and Flow you can use lower case for the following:

```js
const isNumeric = p`number`; // typeof value === 'number'
const isBoolean = p`boolean`; // typeof value === 'boolean'
const isString = p`string`; // typeof value === 'string'
const isSymbol = p`symbol`; // typeof value === 'symbol'
const isArray = p`array`; // Array.isArray(value)
```

You can test both the type and length of strings and arrays by using the length syntax:

```js
p`string[5]`("12345"); // true
p`string[5]`("1234"); // false
p`string[<5]`("1234"); // true

p`array[5]`(1, 2, 3, 4, 5); // true
p`array[5]`(1, 2, 3, 4); // false
p`array[<5]`(1, 2, 3, 4); // true
```

You can also pass in a JavaScript primitive to the template string.

```js
const isNumeric = p`${Number}`; // typeof value === 'number'
const isBoolean = p`${Boolean}`; // typeof value === 'boolean'
const isString = p`${String}`; // typeof value === 'string'
```

### Reference equality

If you pass a value, `pdsl` will match that specific value:

```js
const isLiterallyTrue = p`true`; // value === true;
const isLiterallyFalse = p`false`; // value === false;
const isNine = p`9`; // value === 9;
const isRupert = p`"Rupert"`; // value === "Rupert";
```

### Truthy and Falsy

You can check for truthiness using the truthy and falsy predicates.

```js
// Truthy
p`!!`(0); // false
p`!!`(1); // true

// Falsy
p`!`(false); // true
p`!`(null); // true
p`!`("hello"); // false
```

### Empty comparisons

Checking for empty things:

```js
const isEmptyArray = p`[]`;
const isEmptyObject = p`{}`;
const isEmptyString = p`""`;
const isUndefined = p`undefined`;
const isNull = p`null`;
```

### Operators

You can use familiar JS boolean operators and brackets such as `!`, `&&`, `||`, `(`, or `)` as well as the shorter `&` and `|`:

```js
p`!( null || undefined )`;
p`!( null | undefined )`;
p`number && > 6`;
p`number & > 6`;
```

### Object properties

You can test for an object's properties using the object syntax:

```js
const validate = p`{ name: string }`; // value && typeof value.name === 'string';

validate({ name: "Hello" }); // true
validate({ name: 20 }); // false
```

This applies to checking properties of all JavaScript objects. For example to check a string's length:

```js
const validate = p`string & { length: 7, ... }`; // value && typeof value.name === 'string' && value.name.length === 7;

validate("Rudi"); // false
validate("Yardley"); // true
```

Note you can now use `string[]` syntax to check a string's length.

### Object predicates

You can test for an object property's existence by simply providing an object with a name property.

```js
const validate = p`{ name }`;
validate({ name: "Rudi" }); // true
validate({}); // false
```

This is the same as using `!(null | undefined)` which is also the same as using the shorthand: `_`.

```js
// These are all equivalent
p`{ name }`;
p`{ name: _ }`;
p`{ name: !(null|undefined) }`;
```

You can use literal strings as property checks.

```js
const validate = p`{ name: "Rudi" }`;
validate({ name: "Rudi" }); // true
validate({ name: "Fred" }); // false
```

The property can also contain nested objects.

```js
const validate = p`{ 
  name, 
  payload: {
    listening: true,
    num: > 4
  } 
}`;

validate({ name: "Hello", payload: { listening: true, num: 5 } }); // true
```

### Regular expression predicates

You can use a regular expression as a predicate function.

```js
p`${/^foo/}`("food"); // true
```

### Function predicates

Any function passed as an expression to the template literal will be used as a predicate.

```js
p`${a => a.indexOf("foo") === 0}`("food"); // true
```

## Usage with TypeScript

PDSL is really quite useful in TypeScript as guard functions are important to a good type management strategy. To use in TypeScript simply pass in the guard type you want your predicate to determine as a type prop.

```ts
import p from "pdsl";

// pass in string
const isString = p<string>`string`;

type User = {
  name: string;
  password: string;
};

// pass in User
const isUser = p<User>`{
  name: string[3..8],
  password: string[>5]
}`;

function doStuff(input: string | User) {
  // input is either string or User
  if (isString(input)) {
    // input is now considered a string
    return input.toLowerCase();
  }

  if (isUser(input)) {
    // input is now considered a User
    return input.name;
  }
}
```

## Helpers

PDSL provides a number of helpers that can be exported from the `pdsl/helpers` package and may be used standalone or as part of a `p` expression.

```js
import { Email, pred, btw, gt, regx } from "pdsl/helpers";

btw(1, 10)(20); // false
regx(/^foo/)("food"); // true
gt(100)(100); // false
gte(100)(100); // true
pred(9)(9); // true
pred(9)(10); // false
pred(Email)("hello@world.com"); // true
pred(Number)(1); // true
pred(String)("Hello"); // true
```

Available helpers:

| Helper                                                   | Description                                 | PDSL Operator          |
| -------------------------------------------------------- | ------------------------------------------- | ---------------------- |
| [and](https://ryardley.github.io/pdsl/global.html#and)   | Logical AND                                 | `a & b` or `a && b`    |
| [btw](https://ryardley.github.io/pdsl/global.html#btw)   | Between                                     | `10 < < 100`           |
| [btwe](https://ryardley.github.io/pdsl/global.html#btwe) | Between or equals                           | `10..100`              |
| [deep](https://ryardley.github.io/pdsl/global.html#deep) | Deep equality                               | N/A                    |
| [gt](https://ryardley.github.io/pdsl/global.html#gt)     | Greater than                                | `> 5`                  |
| [gte](https://ryardley.github.io/pdsl/global.html#gte)   | Greater than or equals                      | `>= 5`                 |
| [lt](https://ryardley.github.io/pdsl/global.html#lt)     | Less than                                   | `< 5`                  |
| [lte](https://ryardley.github.io/pdsl/global.html#lte)   | Less than equals                            | `<= 5`                 |
| [not](https://ryardley.github.io/pdsl/global.html#not)   | Logical NOT                                 | `!6`                   |
| [or](https://ryardley.github.io/pdsl/global.html#or)     | Logical OR                                  | `a \| b` or `a \|\| b` |
| [pred](https://ryardley.github.io/pdsl/global.html#pred) | Select the correct predicate based on input | `${myVal}`             |
| [prim](https://ryardley.github.io/pdsl/global.html#prim) | Primitive typeof checking                   | `Array` etc.           |
| [regx](https://ryardley.github.io/pdsl/global.html#regx) | Regular expression predicate                | `${/^foo/}`            |
| [val](https://ryardley.github.io/pdsl/global.html#val)   | Strict equality                             | N/A                    |

For the helper docs please chec the [helper docs](https://ryardley.github.io/pdsl/index.html).

## Usage with Babel

PDSL comes with an experimental [babel plugin](https://github.com/ryardley/pdsl/tree/monorepo/packages/babel-plugin-pdsl).

This plugin speeds up [`pdsl`](https://github.com/ryardley/pdsl) in babelified codebases by pre-compiling p-expressions to predicate function definitions.

```bash
yarn add --dev @pdsl/babel-plugin-pdsl
```

You should ensure it is placed before any plugins that affect module import syntax.

```js
{
  plugins: ["@pdsl/babel-plugin-pdsl"];
}
```

## How it works

This plugin parses p-expressions and replaces them with function calls:

#### Input

```js
import p from "pdsl";

const notNil = p`!(null|undefined)`;
const hasName = p`{name}`;
const isTrue = p`true`;
const hasNameWithFn = p`{name:${a => a.length > 10}}`;
```

#### Output

```js
import { val, not, or, obj, entry, pred } from "pdsl/helpers";

const notNil = val(not(or(val(null), val(undefined))));
const hasName = val(obj("name"));
const isTrue = val(true);
const hasNameWithFn = val(obj(entry("name", pred(a => a.length > 10))));
```

## Roadmap

Help organise our priorities by [telling us what is the most important to you](https://github.com/ryardley/pdsl/issues/new)

- [x] Basic Language Design
- [x] PDSL Compiler
- [x] Comprehensive Test cases
- [x] Babel Plugin to remove compiler perf overhead
- [x] Exact matching by default
- [ ] Validation errors
- [ ] Syntax Highlighting / VSCode Autocomplete / Prettier formatting

## Disclaimer

This should work however this project is young and there is a chance you may find bugs that are not covered by our test suite. Not all safety checks are in place and you may find issues around this.

Please help this open source project by [creating issues](https://github.com/ryardley/pdsl/issues/new).

Pull requests appreciated! [Feel free to help with open issues](https://github.com/ryardley/pdsl/issues).

This Syntax is DRAFT and we are open for [RFCs on the syntax](https://github.com/ryardley/pdsl/issues/new).

All feedback welcome. If you want to be a maintainer [create a pull request](https://github.com/ryardley/pdsl/pulls)

## FAQ

#### What does pdsl stand for?

Predicate Domain Specific Language.

#### Why did you write this?

@ryardley had a need for it when filtering on events in an app working with [ts-bus](https://github.com/ryardley/ts-bus). He also wanted to learn how to create a compiler from scratch.

#### Why would I ever use this?

We think PDSL is a great addition to working with predicates in JavaScript and hope you feel that way too. If there is something stopping you from wanting to use this in your projects we would like to know so [let us know about it here](https://github.com/ryardley/pdsl/issues/new) - perhaps we can fix your problem or prioritize it in our roadmap!

We don't know what's in your head and we want to make libraries that help more people get the most out of programming.

#### How does this work?

It is comprised of a [grammar](packages/pdsl/grammar.js), a [lexer](packages/pdsl/lexer.js) a [parser](packages/pdsl/parser.js) and a [code generator](packages/pdsl/generator.js). It uses a version of the [shunting yard algorhythm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm) to create the basic parser storing the output in [RPN](https://en.wikipedia.org/wiki/Reverse_Polish_notation) but using objects in an array instead of a tree. Then parsing was added for Varadic Functions. A lot of it was by trial and error.

There are better ways to do it. There are [plans to refactor to use a transducer pattern](https://github.com/ryardley/pdsl/issues/33) but there is also a plan to create a babel plugin which will [remove the need for compiler performance enhancement](https://github.com/ryardley/pdsl/issues/32). Nevertheless if you have tips and know how to do it better, faster, stronger or smaller, retaining semantic flexability and with no dependencies - we want to learn - [let us know about it here](https://github.com/ryardley/pdsl/issues/new).
