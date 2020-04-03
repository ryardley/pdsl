---
menu: Guide
route: /validation
---

# Validation

PDSL supports the creation of yup style validation schemas.

To use this feature you export the `schema` named export from the pdsl package.

```javascript
import { schema as p } from "pdsl";
```

You can then create a normal p-expression but include validation messages to the right of your predicates starting with an arrow and followed by a message in double quotes.

```go
<- "This is a validation message"
```

You can then call the async `validate` or the synchronous `validateSync` methods on the object returned.

```js
async function doValidation() {
  const { validate } = p.schema`{ 
    name: string <- "Hey name has to be a string!"
  }`;

  try {
    await validate({ name: 100 });
  } catch (err) {
    console.error(err.message); // "Hey name has to be a string!"
  }
}

doValidation();
```

Here is an example

```js
async function runValidation() {
  const { validate, validateSync } = p.schema`{
    name: 
      string       <- "Name must be a string" 
      & string[>7] <- "Name must be longer than 7 characters",
    age: 
      (number & > 18) <- "Age must be numeric and over 18"
  }`;

  try {
    await validate({ name: "Rick" });
  } catch (err) {
    console.log(err); // "Name must be longer than 7 characters"
  }

  try {
    validateSync({ name: 100, age: 24 });
  } catch (err) {
    console.log(err); // "Name must be a string"
  }

  try {
    await validate({ name: "Rickardo", age: 16 });
  } catch (err) {
    console.log(err); // "Age must be numeric and over 18"
  }

  try {
    validateSync({ name: "Rickardo", age: 24 });
  } catch (err) {
    console.log("Ye gads!");
  }
}

runValidation();
```

## Form validation

You can use this technique to create form validators and then plug them into libraries like formik:

```javascript
import {schema as p} from "pdsl"

() => (
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

## Validation Configuration

If you wish to receive errors as an array of objects instead you can configure the schema not to throw errors.

```js
const pp = p.configureSchema({ throwErrors: false });

const { validateSync } = pp`{
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
}`;

validateSync({
  email: "foo"
});

/* [
  {message:"Invalid email address", path: "email"}, 
  {message:"Required", path: "firstName"}, 
  {message:"Required", path: "lastName"}, 
] */
```
