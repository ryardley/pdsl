---
menu: Guide
route: /types
---

# Primitive matching

If you pass a JavaScript primitive object, you will get the appropriate typeof check.

```javascript
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

```javascript
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

```javascript
const isNumeric = p`${Number}`; // typeof value === 'number'
const isBoolean = p`${Boolean}`; // typeof value === 'boolean'
const isString = p`${String}`; // typeof value === 'string'
```
