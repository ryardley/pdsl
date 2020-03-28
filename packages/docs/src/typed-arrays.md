---
menu: Examples
---

# Typed Arrays

```js
p`Array<number>`([1, 2, 3, 4]); // true
p`Array<number>`([1, 2, true, 4]); // false
```

```js
p`Array<string>`(["1", "2", "3", "4"]); // true
```
