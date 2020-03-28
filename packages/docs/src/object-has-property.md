---
menu: Examples
---

### Object has property

```js
const isObjWithName = p`{ name }`;
```

```js
isObjWithName({ name: "A name" }); // true
isObjWithName({ name: true }); // true
isObjWithName({ name: 0 }); // true
isObjWithName({ name: undefined }); // false
isObjWithName({}); // false
```

This would also be the same as using:

```js
const isObjWithName = p`{ name: _ }`;
```
