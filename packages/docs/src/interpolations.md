---
menu: Guide
route: /interpolations
---

# Interpolations

## Interpolated values

You can interpolate values:

```javascript
p`${true}`(true); // true
p`${false}`(false); // true
p`> ${9}`(9); // false
p`> ${8}`(9); // true
p`${"Rupert"}`("Rupert"); // true
```

```js
p`${"Rupert"}`("Rupert"); // true
```

## Regular expression predicates

You can use a regular expression by interpolating it like you would a predicate function.

```js
p`${/^foo/}`("food"); // true
```

## Javascript predicate functions

Any function passed as an expression to the template literal will be used as a test.

```js
const startsWithFoo = a => a.indexOf("foo") === 0;

p`{ eat: ${startsWithFoo} }`({ eat: "food" }); // true
```
