---
menu: Guide
---

# Booleans

## True and False

You can test for true and false by simply using true and false:

```js
p`true`(true); // true
p`false`(0); // false
p`false`(undefined); // false
p`false`(false); // true
```

## Truthy and Falsy

You can check for truthiness using the truthy and falsy predicates.

```js
// Truthy
p`!!`(0); // false
p`!!`(1); // true

// Falsy
p`!`(false); // true
p`!`(null); // true
p`!"hello"`("hello"); // false
```
