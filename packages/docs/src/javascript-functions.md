---
menu: Usage
---

# Custom predcates

Any function passed as an expression to the template literal will be used as a predicate.

```js
const startsWithFoo = a => a.indexOf("foo") === 0;

p`{ eat: ${startsWithFoo} }`({ eat: "food" }); // true
```
