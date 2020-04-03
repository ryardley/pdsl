---
route: /
name: Welcome to PDSL
---

<div style="display:flex;position:relative; align-items:center; justify-content: center;flex-direction:column;height:75vh">
  <img alt="Welcome to PDSL"  src="/public/pdsl-logo.png" width="200" style="transform:translateX(20px);"/>
  
</div>

---

<br/><br/>

<h1>Welcome to PDSL</h1>
<p>The expressive declarative toolkit for composing predicates in TypeScript or JavaScript</p>

```js
const isSoftwareCreator = p`{ 
  name: string, 
  age: > 16, 
  occupation: "Engineer" | "Designer" | "Project Manager" 
}`;

isSoftwareCreator({
  name: "Jane Kenith",
  age: 22,
  occupation: "Engineer"
}); // true
```

**Predicate functions are just easier with PDSL**

Creating predicate functions in JavaScript is often verbose, especially for checking the format of complex object types. We need predicate functions all the time when filtering an array, validating input, determining the type of an unknown object or creating guard conditions in TypeScript.

PDSL provides the developer a simple but powerful shorthand based on a combination of template strings and helper functions for defining predicate functions that makes it easy to understand intent. With `pdsl` we can easily visualize the expected input's structure and intent using it's intuitive predicate composition language.

PDSL is:

- Intuitive
- Expressive
- Lightweight (under 6k)!
- No dependencies
- Small bundle size
- Fast

## Installation

Install with npm or yarn

```bash
yarn add pdsl
```

```bash
npm install pdsl
```

Then import the default package into your JavaScript or TypeScript file:

```javascript
import p from "pdsl";

p`{ name: string }`({ name: "Jane" });
```

If you have Babel in your build pipeline we recommend to use the [babel plugin](/precompiling-with-babel).

## New in Version 5

### Exact matching on objects is now off by default

New in version 5.2+ objects no longer have exact matching turned on by default. If you wish to continue using exact matching you can use the [exact matching syntax](/objects#exact-matching-syntax):

```js
p`{ name: "foo" }`({ name: "foo", age: 20 }); // true
```

Exact object matching mode can be turned on by using objects with pipes `|`:

```js
p`{| name: "foo" |}`({ name: "foo", age: 20 }); // false
```

Once you turn exact matching on in an object tree you can only turn it off by using the rest operator:

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
    another: []
  }
}); // true
```

### New validation syntax

We now have a new validation syntax!

```js
const { validate } = p.schema`{
  name: 
    string       <- "Name must be a string" 
    & string[>7] <- "Name must be longer than 7 characters",
  age: 
    (number & > 18) <- "Age must be numeric and over 18"
}`;

validate({ name: "Rick" }).catch(err => {
  console.log(err.message); // "Name must be longer than 7 characters"
});
```

### New array includes syntax

Also new we have an [array includes](/arrays#array-includes) function:

```
[? <predicate> ]
```

```js
p`[? >50 ]`([1, 2, 100, 12]); // true because 100 is greater than 50
```

### Formik compatability

We now have formik compatability!

```ts
import {schema as p} from 'pdsl';

export default () => (
  <Formik
    initialValues={{
      email: "",
      firstName: "",
      lastName: ""
    }}
    validationSchema={p`{
      email:
        _         <- "Required"
        & Email   <- "Invalid email address",
      firstName:
        _             <- "Required"
        & string[>2]  <- "Must be longer than 2 characters"
        & string[<20] <- "Nice try nobody has a first name that long",
      lastName:
        _             <- "Required"
        & string[>2]  <- "Must be longer than 2 characters"
        & string[<20] <- "Nice try nobody has a last name that long"
    }`}
    onSubmit={values => {
      // submit values
    }}
    render={({ errors, touched }) => (
      // render form
    )}
  />
)
```

## Roadmap

Help organise our priorities by [telling us what is the most important to you](https://github.com/ryardley/pdsl/issues/new)

- Basic Language Design (✓)
- PDSL Compiler (✓)
- Comprehensive Test cases (✓)
- Babel Plugin to remove compiler perf overhead (✓)
- Validation errors (✓)
- Exact matching syntax (✓)
- Syntax Highlighting / VSCode Autocomplete / Prettier formatting
