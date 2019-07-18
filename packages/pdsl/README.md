# Predicate DSL

#### A short hand domain language for creating predicate functions

## Problem statement

Often when programming we need to create predicate functions to assert facts about a given input value. Creating predicate functions in JavaScript is usually verbose especially for checking the format of complex object types. This library provides the developer a simple but powerful shorthand syntax for defining predicate functions that is easy to understand.

```js
const isComplexObject = obj =>
  /^.+foo$/.test(obj.type) &&
  obj.payload &&
  Array.isArray(obj.payload.arr) &&
  obj.payload.arr.filter(a => a === 6).length > 0 &&
  (obj.payload.num > 4 || obj.payload.num < -100) &&
  obj.payload.bar &&
  /^.+foo$/.test(obj.payload.bar.baz) &&
  obj.payload.bar.foo;
```

```js
import p from "pdsl";

const isComplexObject = p`
  {
    type:${/^.+foo$/},
    payload:{
      arr:[!${6}],
      foo:!${true},
      num:${n => n > 4 || n < -100},
      bar:{
        baz:${/^foo/},
        foo
      }
    }
  }
`;
```

## More examples

```js
// will only match true
const isTrue = p`${true}`;

// will only match false
const isFalse = p`${false}`;

// will only match 9
const isNine = p`${9}`;

// will match 7 or 8
const isBetween6And9 = p`${n => n > 6 && n < 9}`;

// will match an empty array
const isEmptyArray = p`${[]}`;

// will match an empty object
const isEmptyObject = p`${{}}`;

// will match an empty string
const isEmptyString = p`${""}`;

// will match an specific string
const isRupert = p`${"Rupert"}`;

// will match anything numeric
const isNumeric = p`${Number}`;

const isBoolean = p`${Boolean}`;

const isString = p`${String}`;

const isObject = p`${Object}`;

const isSymbol = p`${Symbol}`;

const isFunction = p`${Function}`;

const isUndefined = p`${undefined}`;

const isNull = p`${null}`;

const isFalsy = p`${a => !a}`;

const isTruthy = p`${a => !!a}`;

const isArrayWithLength4 = p`${Array} && {length:${4}}`;

const isArrayContaining7 = p`[${7}]`;

const isArrayContaining7AndStringFoo = p`[${7},${"foo"}]`; // [1,7,'foo']

const isNotArrayContaining7 = p`![${7}]`; // Will match anything such as {} apart from [1,2,3,4,7] or [7]
const isArrayNotContaining7 = p`[!${7}]`; // Will match [1,2,3,4] but not {}
const isEmptyArrayOrEmptyObject = p`${[]}||${{}}`;
const hasName = p`{name}`; // {name: 'foo'}
const hasNameOrhasNum = p`{name}||{num}`;
const hasNameAndNum = p`{name,num}`;
const isNotUndefined = p`!${undefined}`;
const isNil = p`${null}||${undefined}`;
const isNotNil = p`!${p`${null}||${undefined}`}`;
const isNotNil = p`!(${null}||${undefined})`; //this cn be phase 2
```

## Goals

- No dependencies
- Avoid eval
- Bundle size as small as possible
- As fast as possible
