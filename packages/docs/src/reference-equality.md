---
menu: Usage
---

# Reference equality

If you pass a value, `pdsl` will match that specific value:

```js
const isLiterallyTrue = p`true`; // value === true;
const isLiterallyFalse = p`false`; // value === false;
const isNine = p`9`; // value === 9;
const isRupert = p`"Rupert"`; // value === "Rupert";
```
