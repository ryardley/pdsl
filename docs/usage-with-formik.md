---
menu: Integrations
name: Formik form validation
route: /formik-validation
---

# Formik form validation

PDSL provides a handy schema named export that can be used to integrate directly with Formik:

```tsx

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
