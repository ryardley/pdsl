---
menu: Usage
---

# Truthy and Falsy

You can check for truthiness using the truthy and falsy predicates.

```js
// Truthy
p`!!`(0); // false
p`!!`(1); // true

// Falsy
p`!`(false); // true
p`!`(null); // true
p`!`("hello"); // false
```
