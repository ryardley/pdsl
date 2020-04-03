---
menu: Guide
route: /arrays
---

# Arrays

## Empty Array

You can test for an empty array using `[]`

```javascript
p`[]`(null); //false
p`[]`([]); //true
p`[]`([1]); //false
```

```js
p`[]`([]);
```

## Typed Arrays

Typed arrays look like TypeScript typed arrays and can contain only the type specified.

```javascript
p`Array<number>`([1, 2, 3, 4]); // true
p`Array<number>`([1, 2, true, 4]); // false
p`Array<string>`(["1", "2", "3", "4"]); // true
```

```js
p`Array<number>`([1, 2, 3, 4]);
```

## Array length

You can specify an array length using the `array` keyword followed by a length expression in square brackets.

```javascript
p`array[4]`([1, 2, 3, 4]); // true
p`array[4]`([1, 2, 3, 4, 5]); // false
p`array[>4]`([1, 2, 3, 4, 5]); // true
p`array[>4]`([1, 2, 3]); // false
```

```js
p`array[>4]`([1, 2, 3, 4, 5]);
```

## Array with specific items

Simply specify the items in a set of array brackets.

You can use a `*` to indicate any possible type including undefined or null, `_` to indicate anything that is not null or undefined and `...` to indicate that you don't care to match the rest of the array.

```javascript
p`[ 1, 2, 3, 4 ]`([1, 2, 3, 4]); // true
p`[ 1, 2, *, 4 ]`([1, 2, "thing", 4]); // true
p`[ 1, 2, ... ]`([1, 2, "thing", 4, { foo: "foo" }]); // true
```

```js
const arg = [7, "seven", NaN, { type: "SEVEN" }];
p`[ number, string, *, { type: "SEVEN" } ]`(arg);
```

## Array includes

You can check if an array includes an item by using the array includes syntax:

```javascript
p`[? 5]`([1, 2, 3, 4, 5]); // true
p`[? >10]`([1, 2, 30, 4, 5]); // true
p`[? 5]`([1, 2, 3, 4]); // false
```

```js
p`[? "admin"]`(["editor", "admin", "helper"]);
```
