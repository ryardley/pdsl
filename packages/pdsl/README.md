# Predicate Filter Interpolator

#### A short hand for creating predicate functions

## Goals

- No dependencies
- Bundle size as small as possible
- As fast as possible

```js
import p from "pfi";

const isTrue = p`${true}`; // will only match true
const isTrue = n => n === true; // is longer!

const isFalse = p`${false}`; // will only match false
const isNine = p`${9}`; // will only match 9

const isBetween6And9 = p`${n => n > 6 && n < 9}`; // will match 7 or 8
const isArrayWithLength4 = p`[] && {length:${4}}`;
const isArrayWithLength4 = a => Array.isArray(a) && a.length === 4;

const isArrayContaining7 = p`[${7}]`;
const isArrayContaining7AndStringFoo = p`[${7},${"foo"}]`; // [1,7,'foo']
const isNotArrayContaining7 = p`![${7}]`; // Will match anything such as {} apart from [1,2,3,4,7] or [7]
const isArrayNotContaining7 = p`[!${7}]`; // Will match [1,2,3,4] but not {}
const isEmptyArray = p`[]`;
const isEmptyObject = p`{}`;
const isEmptyArrayOrEmptyObject = p`[]||{}`;
const isFalsy = p`!`;
const isTruthy = p`!!`;
const isEmptyString = p`""`;
const isEmptyString = p`${""}`;
const hasName = p`{name}`; // {name: 'foo'}
const hasNameOrhasNum = p`{name}||{num}`;
const hasNameAndNum = p`{name,num}`;
const isRupert = p`${"Rupert"}`;
const isNumeric = p`${Number}`;
const isBoolean = p`${Boolean}`;
const isString = p`${String}`;
const isObject = p`${Object}`;
const isSymbol = p`${Symbol}`;
const isSymbol = s => typeof s === "symbol";
const isFunction = p`${Function}`;
const isUndefined = p`${undefined}`;
const isNotUndefined = p`!${undefined}`;
const isNull = p`${null}`;
const isNil = p`${null}||${undefined}`;

const isNotNil = p`!${p`${null}||${undefined}`}`;

const isNotNil = p`!(${null}||${undefined})`; //this cn be phase 2

const isComplexObject = p`{
  type:${/^.+foo$/},
  payload:{
    arr:![${6}],
    foo:!${true},
    num:${n => n > 4 || n < -100},
    bar:{
      baz:${/^foo/},
      foo
    },
    "foo-bar":${6}
  }
}`;
```
