---
name: Number in range
menu: Examples
---

# Number in Range

```js
const isBetween1And10 = p`1..10`;
```

```js
isBetween1And10(1); // true
isBetween1And10(5); // true
isBetween1And10(10); // true
isBetween1And10(11); // false
```
