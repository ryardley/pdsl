---
menu: Guide
route: /composition
---

# Composition

You can compose p expressions easily.

```js
const Nums = /[0-9]/;
const UpCase = /[A-Z]/;
const NotNumsAndUpCase = p`!${Nums} & !${UpCase}`;
const Extended = /[^a-zA-Z0-9]/;

const isValidUser = p`{
  username: string[4..8] & ${NotNumsAndUpCase},
  password: string[>8] & ${Extended},
  age: > 17
}`;

isValidUser({ username: "ryardley", password: "Hello1234!", age: 21 }); //true
isValidUser({ username: "ryardley", password: "Hello1234!", age: 17 }); //false
isValidUser({ username: "Ryardley", password: "Hello1234!", age: 21 }); //false
isValidUser({ username: "12345", password: "Hello1234!", age: 21 }); //false
isValidUser({ username: "ryardley", password: "12345678", age: 21 }); //false
```

The more complex things get, the more PDSL shines. See the above example in vanilla JS:

```javascript
const isValidUser = input =>
  input &&
  input.username &&
  typeof input.username === "string" &&
  !input.username.match(/[^0-9]/) &&
  !input.username.match(/[^A-Z]/) &&
  input.username.length >= 4 &&
  input.username.length <= 8 &&
  typeof input.password === "string" &&
  input.password.match(/[^a-zA-Z0-9]/) &&
  input.password.length > 8 &&
  input.age > 17;
```
