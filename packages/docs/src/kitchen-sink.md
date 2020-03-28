---
name: Kitchen Sink
menu: Examples
---

# Kitchen sink

```js
// `pdsl` expressively defines an input value's constraints
import p from "pdsl";

const isKitchenSinc = p`
  {
    type: ${/^.+foo$/},
    payload: {
      email: string[>5] & Email,
      arr: [6,'foo', ...], 
      foo: !true,
      num: 1..10,
      bar: {
        baz: ${/^foo/},
        foo: !!
      }
    }
  }
`;

isKitchenSinc({
  type: "snafoo",
  payload: {
    email: "hello@world.com",
    arr: [6, "foo", 1, 2, 3, 4, 5, 6],
    foo: false,
    num: 2,
    bar: {
      baz: "food",
      foo: "I am truthy"
    }
  }
}); // true
```
