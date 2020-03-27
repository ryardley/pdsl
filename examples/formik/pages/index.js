import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { schema as p } from "pdsl";
import { Debug } from "./Debug";

const SignUp = () => (
  <div>
    <h1>Sign up</h1>
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
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
        }, 500);
      }}
      render={({ errors, touched }) => (
        <Form>
          <label htmlFor="firstName">First Name</label>
          <Field name="firstName" placeholder="Jane" type="text" />

          <ErrorMessage
            name="firstName"
            component="div"
            className="field-error"
          />

          <label htmlFor="lastName">Last Name</label>
          <Field name="lastName" placeholder="Doe" type="text" />
          <ErrorMessage
            name="lastName"
            component="div"
            className="field-error"
          />

          <label htmlFor="email">Email</label>
          <Field name="email" placeholder="jane@acme.com" type="email" />
          <ErrorMessage name="email" component="div" className="field-error" />

          <button type="submit">Submit</button>
          <Debug />
        </Form>
      )}
    />
  </div>
);

export default SignUp;
