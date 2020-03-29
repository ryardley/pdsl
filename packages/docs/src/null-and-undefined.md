---
menu: Guide
route: /null-undefined
---

# Null checking

## Explicit null checking

To check if a value is specifically `undefined` or specifically `null` you just use the term you want to check for:

```js
p`undefined`(0); // false
p`undefined`(undefined); // true
p`null`(null); // true
p`null`(undefined); // false
```

## Extant operator

To check if a value is not null or undefined you can use the extant operator `_`:

```js
p`_`(0); // true
p`_`(null); // false
p`_`(undefined); // false
p`_`(NaN); // true
```

You can always reverse the polarity using the boolean not operator to specifically test for `null` or `undefined`:

```js
p`!_`(null); // true
```

or you can be explicit:

```js
p`null|undefined`(null); // true
p`null|undefined`(0); // false
```

## Nullish things

if you want to do boolean coercion you can use the boolean coercion (falsey) operator:

```js
p`!`(null); // true
p`!`(undefined); // true
p`!`(NaN); // true
p`!`(0); // true
```

## Empty comparisons

Checking for empty things works as you would expect:

```js
p`[]`([]); // true
p`{}`({}); // true
p`""`(""); // true
p`undefined`(undefined); // true
p`null`(null); // true
```
