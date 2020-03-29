---
menu: Guide
route: /arrays
---

# Arrays

## Empty Array

```js
p`[]`(null); //false
p`[]`([]); //true
p`[]`([1]); //false
```

## Typed Arrays

```js
p`Array<number>`([1, 2, 3, 4]); // true
p`Array<number>`([1, 2, true, 4]); // false
p`Array<string>`(["1", "2", "3", "4"]); // true
```

## Array length

```js
p`array[4]`([1, 2, 3, 4]); // true
p`array[4]`([1, 2, 3, 4, 5]); // false
p`array[>4]`([1, 2, 3, 4, 5]); // true
p`array[>4]`([1, 2, 3]); // false
```

## Array with specific items

Simply specify the items in a set of array brackets.

You can use a `*` to indicate any possible type including undefined or null, `_` to indicate anything that is not null or undefined and `...` to indicate that you don't care to match the rest of the array.

```js
p`[ 1, 2, 3, 4 ]`([1, 2, 3, 4]); // true
p`[ 1, 2, *, 4 ]`([1, 2, "thing", 4]); // true
p`[ 1, 2, ... ]`([1, 2, "thing", 4, { foo: "foo" }]); // true

const arr = [7, "seven", NaN, { type: "SEVEN" }];
p`[ number, string, *, { type: "SEVEN" } ]`(arr); // true
```

## Array includes

You can check if an array includes an item by using the array includes syntax:

```js
p`[? 5]`([1, 2, 3, 4, 5]); // true
p`[? 5]`([1, 2, 3, 4]); // false
```
