---
menu: Guide
route: /values
---

# Reference equality

If you pass a value, `pdsl` will match that specific value:

```javascript
p`true`(true); // true
p`false`(false); // true
p`9`(9); // true
p`"Rupert"`("Rupert"); // true
```

```js
p`"Rupert"`("Rupert");
```

## Interpolated values

You can also interpolate values:

```javascript
p`${true}`(true); // true
p`${false}`(false); // true
p`> ${9}`(9); // false
p`> ${8}`(9); // true
p`${"Rupert"}`("Rupert"); // true
```

```js
p`${9}`(9);
```
