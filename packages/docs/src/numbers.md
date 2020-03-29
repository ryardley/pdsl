---
menu: Guide
route: /numbers
---

# Numbers

## Number in Range

```js
p`1..10`(1); // true
p`1..10`(5); // true
p`1..10`(10); // true
p`1..10`(11); // false
```

## Less than and greater than

```js
p`< 10`(5); // true
p`< 10`(12); // false
p`>= 10`(10); // true
p`> 10`(10); // false
```
