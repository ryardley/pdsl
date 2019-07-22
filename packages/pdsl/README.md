# pdsl

### An expressive declarative toolkit for creating predicate functions

Often when programming we need to create predicate or boolean returning functions to assert facts about a given input value. This is often the case when filtering an array, validating input or determining type. Creating predicate functions in JavaScript is often verbose, especially for checking the format of complex object types. `pdsl` provides the developer a simple but powerful shorthand based on a combination of template strings and helper functions for defining predicate functions that makes it easy to understand intent.

With `pdsl` we can easily visualize the expected input's structure and intent.

```js

import p from 'pdsl';
import { Email, has, btw, gt } from 'pdsl/helpers';

// `pdsl` expressively defines an input value's constraints
const isComplexObject = p`
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
  }
`;

isComplexObject({
  type: "yafoo",
  payload: {
    email: "a@b.com",
    arr: [1,2,3,'foo'],
    foo: false,
    num: 2,
    bar: {
      baz: "food",
      foo: "yup",
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

If you pass a JavaScript primative object you will get the appropriate typeof check.

```js
const isNumeric = p`${Number}`; // typeof value === 'number'
const isBoolean = p`${Boolean}`; // typeof value === 'boolean'
const isString = p`${String}`; // typeof value === 'string'
const isObject = p`${Object}`; // typeof value === 'object'
const isBigInt = p`${BigInt}`; // typeof value === 'bigint'
const isSymbol = p`${Symbol}`; // typeof value === 'symbol'
const isFunction = p`${Function}`; // typeof value === 'function'
```

### Reference equality

If you pass a value `pdsl` will match that specific value:

```js
const isTrue = p`${true}`; // value === true;
const isFalse = p`${false}`; // value === false;
const isNine = p`${9}`; // value === 9;
const isRupert = p`${"Rupert"}`; // value === "Rupert";
```

### Empty comparisons

Checking for empty things

```js
const isEmptyArray = p`${[]}`;
const isEmptyObject = p`${{}}`;
const isEmptyString = p`${""}`;
const isUndefined = p`${undefined}`;
const isNull = p`${null}`;
```

### Operators

You can use familiar JS boolean operators and brackets such as `!`, `&&`, `||`, `(`, or `)`:

```js
const isNotNil = p`!(${null}||${undefined})`;
```

```js
const is6CharString = p`${String} && { length: ${6} }`;
```

### Object properties

You can test for an object's properties using the object syntax:

```js
const validate = p`{ name: ${String} }`; // value && typeof value.name === 'string';

validate({ name: "Hello" }); // true
validate({ name: 20 }); // false
```

This applies to checking properties of all javascript objects. For example to check a string's length:

```js
const validate = p`${String} && { length: ${7} }`;  // value && typeof value.name === 'string' && value.name.length === 7;

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
const validate = p`{ name: ${"Rudi"} }`;
validate({ name: "Rudi" }); // true
validate({ name: "Fred" }); // false
```

The property can also contain nested objects.

```js
const validate = p`{ 
  name, 
  payload: {
    listening:${true},
    num: ${gt(4)}
  } 
}`;

validate({ name: "Hello", payload: { listening: true, num: 5 } }); // true
```

### Regular expression predicates

You can use a regular expression as a predicate function.

```js
p`${/^foo/}`('food'); // true
```

### Function predicates

Any function passed as an expression to the template literal will be used as a predicate.

```js
p`${a => a.indexOf('foo') === 0}`('food'); // true
```

## Helpers

Helpers can be exported from the `pdsl/helpers` package and may be used standalone or as part of a `p` expression.

```js
import { Email, pred, has, btw, gt, regx } from 'pdsl/helpers';

// Regular expression helpers
Email.test("hello@world.com"); // true

// Predicate helpers
btw(1,10)(20); // false
regx(/^foo/)("food"); // true
has(5)([1,2,3,4,5]); // true
has(6)([1,2,3,4,5]); // false
gt(100)(100); // false
gte(100)(100); // true
pred(9)(9); // true
```

Available helpers:

* [and](https://ryardley.github.io/pdsl/global.html#and)
* [btw](https://ryardley.github.io/pdsl/global.html#btw)
* [btwi](https://ryardley.github.io/pdsl/global.html#btwi)
* [deep](https://ryardley.github.io/pdsl/global.html#deep)
* [gt](https://ryardley.github.io/pdsl/global.html#gt)
* [gte](https://ryardley.github.io/pdsl/global.html#gte)
* [has](https://ryardley.github.io/pdsl/global.html#has)
* [lt](https://ryardley.github.io/pdsl/global.html#lt)
* [lte](https://ryardley.github.io/pdsl/global.html#lte)
* [not](https://ryardley.github.io/pdsl/global.html#not)
* [or](https://ryardley.github.io/pdsl/global.html#or)
* [pred](https://ryardley.github.io/pdsl/global.html#pred)
* [prim](https://ryardley.github.io/pdsl/global.html#prim)
* [regx](https://ryardley.github.io/pdsl/global.html#regx)
* [val](https://ryardley.github.io/pdsl/global.html#val)

For the helper docs please chec the [helper docs](https://ryardley.github.io/pdsl/index.html).

## FAQ

#### What does pdsl stand for?

Predicate Domain Specific Language.

## Goals

- No dependencies
- Avoid eval
- Bundle size as small as possible
- Fast

## Disclaimer

This is a work in progress and there may be bugs that have not yet been tested for. Please help this open source project by creating issues.
