---
menu: Guide
route: /null-undefined
---

# Null checking

## Explicit null checking

To check if a value is specifically `undefined` or specifically `null` you just use the term you want to check for:

```javascript
p`undefined`(0); // false
p`undefined`(undefined); // true
p`null`(null); // true
p`null`(undefined); // false
```

```js
p`null`(undefined); // false
```

## Extant operator

To check if a value is not null or undefined you can use the extant operator `_`:

```javascript
p`_`(0); // true
p`_`(null); // false
p`_`(undefined); // false
p`_`(NaN); // true
```

You can always reverse the polarity using the boolean not operator to specifically test for `null` or `undefined`:

```javascript
p`!_`(null); // true
```

or you can be explicit:

```javascript
p`null|undefined`(null); // true
p`null|undefined`(0); // false
```

```js
p`_`(0); // true
```

## Nullish things

if you want to do boolean coercion you can use the boolean coercion (falsey) operator:

```javascript
p`!`(null); // true
p`!`(undefined); // true
p`!`(NaN); // true
p`!`(0); // true
```

```js
p`!`(null);
```

## Empty comparisons

Checking for empty things works as you would expect:

```javascript
p`[]`([]); // true
p`{}`({}); // true
p`""`(""); // true
p`undefined`(undefined); // true
p`null`(null); // true
```

```js
p`[]`([]); // true
```
