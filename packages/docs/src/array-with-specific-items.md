---
name: Array with specific items
menu: Examples
---

# Array with specific items

Simply specify the items in a set of array brackets.

You can use a `*` to indicate any possible type including undefined or null, `_` to indicate anything that is not null or undefined and `...` to indicate that you don't care to match the rest of the array.

```js
p`[ 1, 2, 3, 4 ]`([1, 2, 3, 4]); // true
```

```js
p`[ 1, 2, *, 4 ]`([1, 2, "thing", 4]); // true
```

```js
p`[ 1, 2, ... ]`([1, 2, "thing", 4, { foo: "foo" }]); // true
```

```js
const arr = [7, "seven", NaN, { type: "SEVEN" }];

p`[ number, string, *, { type: "SEVEN" } ]`(arr); // true
```
