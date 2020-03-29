---
menu: Guide
route: /values
---

# Reference equality

If you pass a value, `pdsl` will match that specific value:

```js
p`true`(true); // true
p`false`(false); // true
p`9`(9); // true
p`"Rupert"`("Rupert"); // true
```

## Interpolated values

You can also interpolate values:

```js
p`${true}`(true); // true
p`${false}`(false); // true
p`> ${9}`(9); // false
p`> ${8}`(9); // true
p`${"Rupert"}`("Rupert"); // true
```
