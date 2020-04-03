---
menu: Guide
route: /numbers
---

# Numbers

## Number in Range

```javascript
p`1..10`(1); // true
p`1..10`(5); // true
p`1..10`(10); // true
p`1..10`(11); // false
```

```js
p`1..10`(6);
```

## Less than and greater than

```javascript
p`< 10`(5); // true
p`< 10`(12); // false
p`>= 10`(10); // true
p`> 10`(10); // false
```

```js
p`< 10 & > 3`(6);
```
