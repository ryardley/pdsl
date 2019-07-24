# pdsl

> An expressive declarative toolkit for creating functions that return true or false (predicate functions)

[![Build Status](https://travis-ci.com/ryardley/pdsl.svg?branch=master)](https://travis-ci.com/ryardley/pdsl)

## Predicate functions are just easier with PDSL

Often when programming we need to create predicate or boolean returning functions to assert facts about a given input value. This is often the case when filtering an array, validating input or determining type. Creating predicate functions in JavaScript is often verbose, especially for checking the format of complex object types. `pdsl` provides the developer a simple but powerful shorthand based on a combination of template strings and helper functions for defining predicate functions that makes it easy to understand intent.

With `pdsl` we can easily visualize the expected input's structure and intent using it's intuitive DSL.

## Examples

### Object has truthy property

_Vanilla JS:_

```js
const hasName = input => input && input.name;
```

__PDSL:__

```js
const hasName = p`{name}`;
```

```js
hasName({name: "A name"}); // true
hasName({name: true}); // true
hasName({}); // false
```

### Number is between two values

_Vanilla JS:_

```js
const isRoughlyPi = input => input > 3.1415 && input < 3.1416;
```

__PDSL:__

```js
const isRoughlyPi = p`3.1415< <3.1416`;
```

```js
isRoughlyPi(Math.PI); // true
isRoughlyPi(3.1417); // flse
```

### Input is numeric

_Vanilla JS:_

```js
const isNumeric = input => typeof input === 'number`;
```

__PDSL:__

```js
const isNumeric = p`Number`;
```

```js
isNumeric(3.1415); // true
isNumeric("123"); // false
```

### Input is an Array with more than 4 items

_Vanilla JS:_

```js
const is4ItemArray = input => Array.isArray(input) && input.length > 4;
```

_PDSL:_

```js
const is4ItemArray = p`Array&&{length:>4}`;
```

```js
is4ItemArray([1,2,3,4]); // true
is4ItemArray([1,2,3,4,5]); // false
```

### User validation

You can compose p expressions easily.

```js
const isOnlyLowerCase = p`String && !Nc && !Uc`;
const hasExtendedChars = p`String && Xc`;

const isValidUser = p`{
  username: ${isOnlyLowerCase} && {length: 5 < < 9 },
  password: ${hasExtendedChars} && {length: > 8},
  age: > 17
}`;

isValidUser({ username: "ryardley", password: "Hello1234!", age: 21 }); //true
isValidUser({ username: "ryardley", password: "Hello1234!", age: 17 }); //false
isValidUser({ username: "Ryardley", password: "Hello1234!", age: 21 }); //false
isValidUser({ username: "123456", password: "Hello1234!", age: 21 }); //false
isValidUser({ username: "ryardley", password: "12345678", age: 21 }); //false
```

The more complex things get, the more PDSL shines see the above example in vanilla JS:

```js
const isValidUser = input => {
  input && 
  input.username &&
  typeof input.username === 'string' &&
  !input.username.match(/[^0-9]/) &&
  !input.username.match(/[^A-Z]/) &&
  input.username.length > 5 &&
  input.username.length < 9 &&
  typeof input.password === 'string' &&
  input.password.match(/[^a-zA-Z0-9]/)
  input.password.length > 8 &&
  input.age > 17
}
```

### Complex Example

```js
// `pdsl` expressively defines an input value's constraints
import p from "pdsl";

const isKitchenSinc = p`
  {
    type: ${/^.+foo$/},
    payload: {
      email: Email && { length: > 5 },
      arr: ![6],
      foo: !true,
      num: -4 < < 100,
      bar: {
        baz: ${/^foo/},
        foo
      }
    }
  }
`;

isKitchenSinc({
  type: "yafoo",
  payload: {
    email: "a@b.com",
    arr: [1, 2, 3, "foo"],
    foo: false,
    num: 2,
    bar: {
      baz: "food",
      foo: "yup"
    }
  }
}); // true
```

## Goals

- No dependencies
- Avoid eval
- Bundle size as small as possible
- Fast

## Disclaimer

This should work but there is a chance you may find bugs that are not covered by our test suite. Not all safety checks are in place and you may find issues around this. Please help this open source project by creating issues. Pull requests appreciated! Feel free to help with open issues.

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

If you pass a JavaScript primative object you will get the appropriate typeof check.

```js
const isNumeric = p`Number`; // typeof value === 'number'
const isBoolean = p`Boolean`; // typeof value === 'boolean'
const isString = p`String`; // typeof value === 'string'
const isObject = p`Object`; // typeof value === 'object'
const isBigInt = p`BigInt`; // typeof value === 'bigint'
const isSymbol = p`Symbol`; // typeof value === 'symbol'
const isFunction = p`Function`; // typeof value === 'function'
const isArray = p`Array`; // Array.isArray(value)
```

### Reference equality

If you pass a value `pdsl` will match that specific value:

```js
const isTrue = p`true`; // value === true;
const isFalse = p`false`; // value === false;
const isNine = p`9`; // value === 9;
const isRupert = p`"Rupert"`; // value === "Rupert";
```

### Empty comparisons

Checking for empty things

```js
const isEmptyArray = p`[]`;
const isEmptyObject = p`{}`;
const isEmptyString = p`""`;
const isUndefined = p`undefined`;
const isNull = p`null`;
```

### Operators

You can use familiar JS boolean operators and brackets such as `!`, `&&`, `||`, `(`, or `)`:

```js
const isNotNil = p`!(null||undefined)`;
```

```js
const is6CharString = p`String && { length: 6 }`;
```

### Object properties

You can test for an object's properties using the object syntax:

```js
const validate = p`{ name: String }`; // value && typeof value.name === 'string';

validate({ name: "Hello" }); // true
validate({ name: 20 }); // false
```

This applies to checking properties of all javascript objects. For example to check a string's length:

```js
const validate = p`String && { length: 7 }`; // value && typeof value.name === 'string' && value.name.length === 7;

validate("Rudi"); // false
validate("Yardley"); // true
```

### Object predicates

You can test for object property truthiness by simply providing an object with a name property.

```js
const validate = p`{ name }`;
validate({ name: "Rudi" }); // true
validate({}); // false
```

You can apply a predicate function to the property.

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
    listening:true,
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

## Helpers

PDSL provides a number of helpers that can be exported from the `pdsl/helpers` package and may be used standalone or as part of a `p` expression.

```js
import { Email, pred, holds, btw, gt, regx } from "pdsl/helpers";

btw(1, 10)(20); // false
regx(/^foo/)("food"); // true
holds(5)([1, 2, 3, 4, 5]); // true
holds(6)([1, 2, 3, 4, 5]); // false
gt(100)(100); // false
gte(100)(100); // true
pred(9)(9); // true
pred(9)(10); // false
pred(Email)("hello@world.com"); // true
pred(Number)(1); // true
pred(String)("Hello"); // true
```

Available helpers:

| Helper                                                     | Description                                 | pdsl operator  |
| ---------------------------------------------------------- | ------------------------------------------- | -------------- |
| [and](https://ryardley.github.io/pdsl/global.html#and)     | Logical AND                                 | `a && b`       |
| [btw](https://ryardley.github.io/pdsl/global.html#btw)     | Between                                     | `10 < < 100`   |
| [btwe](https://ryardley.github.io/pdsl/global.html#btwe)   | Between or equals                           | `10 <= <= 100` |
| [deep](https://ryardley.github.io/pdsl/global.html#deep)   | Deep equality                               |                |
| [gt](https://ryardley.github.io/pdsl/global.html#gt)       | Greater than                                | `> 5`          |
| [gte](https://ryardley.github.io/pdsl/global.html#gte)     | Greater than or equals                      | `>= 5`         |
| [holds](https://ryardley.github.io/pdsl/global.html#holds) | Array holds input                           | `[4,3]`        |
| [lt](https://ryardley.github.io/pdsl/global.html#lt)       | Less than                                   | `< 5`          |
| [lte](https://ryardley.github.io/pdsl/global.html#lte)     | Less than equals                            | `<= 5`         |
| [not](https://ryardley.github.io/pdsl/global.html#not)     | Logical NOT                                 | `!6`           |
| [or](https://ryardley.github.io/pdsl/global.html#or)       | Logical OR                                  | `a || b`       |
| [pred](https://ryardley.github.io/pdsl/global.html#pred)   | Select the correct predicate based on input | `${}`          |
| [prim](https://ryardley.github.io/pdsl/global.html#prim)   | Primative typeof checking                   | `Array` etc.   |
| [regx](https://ryardley.github.io/pdsl/global.html#regx)   | Regular expression predicate                | `${/^foo/}`    |
| [val](https://ryardley.github.io/pdsl/global.html#val)     | Strict equality                             |                |

For the helper docs please chec the [helper docs](https://ryardley.github.io/pdsl/index.html).

## Usage with TypeScript

Coming soon.

## FAQ

#### What does pdsl stand for?

Predicate Domain Specific Language.

#### Why did you write this?

I had a need for it when filtering on events in an app working with my event bus framework [ts-bus](https://github.com/ryardley/ts-bus). I also wanted to learn to create a compiler from scratch. 

#### How does this work? 

It is comprised of a [lexer](https://en.wikipedia.org/wiki/Lexical_analysis) a [parser](https://en.wikipedia.org/wiki/Parsing#Parser) and a [code generator](https://en.wikipedia.org/wiki/Code_generation_(compiler)). I used a version of the [shunting yard algorhythm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm) to create the basic parser storing the output in [RPN](https://en.wikipedia.org/wiki/Reverse_Polish_notation) but using objects in an array. I then added parsing for Varadic Functions. A lot of it was by trial and error. I am certain there are better ways to do it. If you know how I can do so with no dependencies I want to hear about it!
