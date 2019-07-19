# pdsl

### An expressive shorthand for creating boolean functions

Often when programming we need to create predicate or boolean returning functions to assert facts about a given input value. This is often the case when filtering an array, validating input or determining type. Creating predicate functions in JavaScript is often verbose, especially for checking the format of complex object types. `pdsl` provides the developer a simple but powerful shorthand based on a combination of template strings and helper functions for defining predicate functions that makes it easy to understand intent.

With `pdsl` we can easily visualize the expected input's structure and intent.

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
p`${a => a.indexOf('foo') === 0}`('food'); // true
```

## Helpers

Helpers can be exported from the `pdsl/helpers` package and may be used standalone or as part of a `p` expression.

### `Email`

Email regex

```js
Email.test("foo@bar.com"); // true
Email.test("hello"); //false
```
### `btw`

Between helper. Tests if an input is between two numbers. This does not test if the input is a number.

```js
const btw10To100 = btw(10, 100);

btw10To100(50); // true
btw10To100(-50); // false
btw10To100(100); // false
btw10To100(10); // false
```

### `btwi` 

Between inclusive. Same as `btw` but inclusive of the range edges.

```js
const btwi10To100 = btwi(10, 100)

btwi10To100(50); // true
btwi10To100(-50); // false
btwi10To100(100); // true
btwi10To100(10); // true
```

### `has`

Tests to see if an iterable contains an element.

```js
const has10 = has(10);

has10([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); //true
has10([1, 2, 3, 4, 5, 6, 7, 8, 9, 9]); //false
```

### `lt`

Less than.

```js
const lt10 = lt(10);

lt10(10); // false
lt10(50); // false
lt10(-50); // true
```

### `lte`

Less than or equal.

```js
const lte10 = lte(10);

lte10(10); // true
lte10(50); // false
lte10(-50); // true
```

### `gt`

Greater than.

```js
const gt10 = gt(10);

gt10(10); // false
gt10(50); // true
gt10(-50); // false
```

### `gte`

Greater than or equal.

```js
const gte10 = gte(10);

gte10(10); // true
gte10(50); // true
gte10(-50); // false
```

## FAQ

#### What does pdsl stand for?

Predicate Domain Specific Language.

## Goals

- [x] No dependencies
- [x] Avoid eval
- [x] Bundle size as small as possible
- [ ] As fast as possible

## Disclaimer

This is a work in progress and there may be bugs that have not yet been tested for. Please help this open source project by creating issues.
