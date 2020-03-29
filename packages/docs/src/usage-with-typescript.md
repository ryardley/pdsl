---
menu: Integrations
name: Usage with TypeScript
route: /typescript
---

# Usage with TypeScript

PDSL is really quite useful in TypeScript as guard functions are important to a good type management strategy. To use in TypeScript simply pass in the guard type you want your predicate to determine as a type prop.

```ts
import p from "pdsl";

// pass in string
const isString = p<string>`string`;

type User = {
  name: string;
  password: string;
};

// pass in User
const isUser = p<User>`{
  name: string[3..8],
  password: string[>5]
}`;

function doStuff(input: string | User) {
  // input is either string or User
  if (isString(input)) {
    // input is now considered a string
    return input.toLowerCase();
  }

  if (isUser(input)) {
    // input is now considered a User
    return input.name;
  }
}
```
