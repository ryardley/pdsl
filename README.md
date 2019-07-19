# pdsl

### An expressive shorthand for creating boolean functions

Often when programming we need to create predicate or boolean returning functions to assert facts about a given input value. This is often the case when filtering an array, validating input or determining type. Creating predicate functions in JavaScript is often verbose, especially for checking the format of complex object types. `pdsl` provides the developer a simple but powerful shorthand based on a combination of template strings and helper functions for defining predicate functions that makes it easy to understand intent.

```js
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

### Complex object example

Let's compare writing a complex predicate object by hand with using `pdsl`.

What if we want to test to see if an input object satisfies a large number of predicate tests:

```js
// It is difficult to understand this code's intent clearly.
function isComplexObject(obj) {
  return (
    /^.+foo$/.test(obj.type) &&
    obj.payload &&
    obj.payload.email &&
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/.test(
      obj.payload.email
    ) &&
    obj.payload.email.length > 5 &&
    Array.isArray(obj.payload.arr) &&
    obj.payload.arr.indexOf(6) === -1 &&
    obj.payload.num > -4 &&
    obj.payload.num < 100 &&
    obj.payload.bar &&
    obj.payload.bar.baz &&
    /^.+foo$/.test(obj.payload.bar.baz) &&
    obj.payload.bar.foo
  );
}
```

With `pdsl` this is much clearer:

```js
import p from "pdsl";
import { Email, btw, gt, has } from "pdsl/helpers";

// `pdsl` expressively defines the objects' constraints
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
```

With `pdsl` we can easily visualize the expected object structure and intent.

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
const isTrue = p`${true}`;
const isFalse = p`${false}`;
const isNine = p`${9}`;
const isRupert = p`${"Rupert"}`;
```

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
const validate = p`{ name: ${String} }`;

validate({ name: "Hello" }); // true
validate({ name: 20 }); // false
```

This applies to checking properties of all javascript objects. For example to check a string's length:

```js
const validate = p`${String} && { length: ${7} }`;

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
p`${a => /^foo/.test(a)}`('food'); // true
```

## Helpers

### `Email`

Email regex

```js
Email.test("foo@bar.com"); // true
Email.test("hello"); //false
```
### `btw`

Between helper. Tests if an input is between two numbers. This does not test if the input is a number.

```js
btw(10, 100)(50)); // true
btw(10, 100)(-50)); // false
btw(10, 100)(100); // false
btw(10, 100)(10); // false
```

### `btwi` 

Between inclusive. Same as `btw` but inclusive of the range edges.

```js
btwi(10, 100)(50); // true
btwi(10, 100)(-50); // false
btwi(10, 100)(100); // true
btwi(10, 100)(10); // true
```

### `has`

Tests to see if an iterable contains an element.

```js
has(10)([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); //true
has(10)([1, 2, 3, 4, 5, 6, 7, 8, 9, 9]); //false
```

### `lt`

Less than 

### `lte`

Less than equals

### `gt`

Greater than 

### `gte`

Greater than equals

## FAQ

#### What does pdsl stand for?

Predicate Domain Specific Language.

## Goals

- No dependencies
- Avoid eval
- Bundle size as small as possible
- As fast as possible

## Disclaimer

This is a work in progress and there may be bugs that have not yet been tested for. Please help this open source project by creating issues.
