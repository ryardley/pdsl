---
menu: Guide
route: /objects
---

# Objects

## Empty Objects

Checking for empty objects:

```javascript
p`{}`({}); // true
p`{}`(undefined); // false
p`{}`({ name: "John" }); // false
```

```js
p`{}`({});
```

## Object properties

Test for an object property's existence by simply providing an object with a property name.

```javascript
p`{ name }`({ name: "Rudi" }); // true
p`{ age }`({ age: 0 }); // true
p`{ color }`({ color: undefined }); // false
p`{ type }`({ type: null }); // false
```

```js
p`{ name }`({ name: "Rudi" });
```

This is the same as using `!(null | undefined)` which is also the same as using the shorthand: `_`.

```javascript
// These are all equivalent
p`{ name }`;
p`{ name: _ }`;
p`{ name: !(null|undefined) }`;
```

You can pass expressions to test agains the object's value:

```javascript
p`{ name: "Goodbye" | "Hello" }`({ name: "Hello" }); // true
p`{ name: >19 & <25 }`({ name: 20 }); // true
p`{ name: 19..25 }`({ name: 20 }); // true
```

```js
p`{ name: "Goodbye" | "Hello" }`({ name: "Hello" });
```

The property can also contain nested objects.

```js
const validate = p`{ 
  name, 
  payload: {
    listening: true,
    num: >4
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

```javascript
p`{ name }`({ name: "A name", age: 234 }); // true
```

Exact object matching mode can be turned on by using objects with pipes `|`:

```javascript
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

## Loose matching operator

Once you turn exact matching on in an object tree you can only turn it off by using the `...` loose matching operator:

```js
p`{| 
  name: "foo",
  exact: {
    hello:"hello"
  },
  loose: {
    hello: "hello",
    ...
  }
|}`({
  name: "foo",
  exact: {
    hello: "hello"
  },
  loose: {
    hello: "hello",
    extra: true,
    other: 10
  }
});
```
