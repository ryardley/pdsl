---
menu: Examples
---

# Quick nil check

_UPDATE: PDSL is quicker to type, expresses intent and is a fair bit shorter but in PDSL we like things even shorter and this is so common in programming that PDSL now provides an extant predicate:_

```js
const extant = p`_`;
```

---

```js
const extant = p`!(null|undefined)`;
```

```js
extant("something"); // true
extant(false); // true
extant(0); // true
extant(null); // false
extant(undefined); // false
```
