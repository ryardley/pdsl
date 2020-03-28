---
name: Array length
menu: Examples
---

# Array length

```js
const is4ItemArray = p`array[4]`;
```

```js
p`array[4]`([1, 2, 3, 4]); // true
p`array[4]`([1, 2, 3, 4, 5]); // false
```

With greater than 4 items:

```js
p`array[>4]`([1, 2, 3, 4, 5]); // true
```
