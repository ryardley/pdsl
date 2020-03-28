---
menu: Usage
---

# Objects

## Object properties

You can test for an object's properties using the object syntax:

```js
const validate = p`{ name: string }`; // value && typeof value.name === 'string';

validate({ name: "Hello" }); // true
validate({ name: 20 }); // false
```

As a shorthand you can test for an object property's existence by simply providing an object with a name property.

```js
const validate = p`{ name }`;
validate({ name: "Rudi" }); // true
validate({}); // false
```

This is the same as using `!(null | undefined)` which is also the same as using the shorthand: `_`.

```js
// These are all equivalent
p`{ name }`;
p`{ name: _ }`;
p`{ name: !(null|undefined) }`;
```

You can use literal strings as property checks.

```js
const validate = p`{ name: "Rudi" }`;
validate({ name: "Rudi" }); // true
validate({ name: "Fred" }); // false
```

Or even provide a list of possible strings using the `|` operator

```js
const validate = p`{ name: "Rudi" | "Fred" }`;
validate({ name: "Rudi" }); // true
validate({ name: "Fred" }); // true
validate({ name: "Mary" }); // true
```

The property can also contain nested objects.

```js
const validate = p`{ 
  name, 
  payload: {
    listening: true,
    num: > 4
  } 
}`;

validate({
  name: "Hello",
  payload: {
    listening: true,
    num: 5
  }
}); // true
```

## Exact matching syntax

PDSL is loose matches objects by default which means the following:

```js
p`{ name }`({ name: "A name", age: 234 }); // true
```

Exact object matching mode can be turned on by using objects with pipes `|`:

```js
p`{| name |}`({ name: "A name", age: 234 }); // false
p`{| name |}`({ name: "A name" }); // true
```

All nested normal objects will become exact matching too within the exact matching tokens:

```js
p`{|
    name,
    age,
    sub: {
      num: 100
    }
  |}`({
  name: "Fred",
  age: 12,
  sub: {
    num: 100,
    foo: "foo"
  }
}); // false
```

## Rest operator

Once you turn exact matching on in an object tree you can only turn it off by using the rest operator:

```js
p`{| 
  name: "foo",
  exact: {
    hello:"hello"
  }
  loose: {
    hello: "hello",
    ...
  },
|}`;
```
