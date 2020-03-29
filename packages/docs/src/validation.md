---
menu: Guide
---

# Validation

PDSL supports the creation of yup style validation schemas.

To use this feature you export the `schema` named export from the pdsl package.

```js
import { schema } from "pdsl";
```

You can then create a normal p-expression but include validation messages to the right of your predicates starting with an arrow and followed by a message in double quotes.

```go
<- "This is a validation message"
```

You can then call the async `validate` or the synchronous `validateSync` methods on the object returned.

```js
import { schema as p } from "pdsl";

p`{ 
  name: string <- "Hey name has to be a string!"
}`
  .validate({ name: 100 })
  .catch(err => {
    console.error(err.message); // "Hey name has to be a string!"
  });
```

You can use this technique to create form validators and then plug them into libraries like formik:

```js
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
