---
menu: Usage
---

# Regular expression predicates

You can use a regular expression by interpolating it like you would a predicate function.

```js
p`${/^foo/}`("food"); // true
```
