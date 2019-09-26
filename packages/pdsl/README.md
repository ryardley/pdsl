<img src="pdsl-logo.png" width="200" />

# Predicate Domain Specific Language

#### An expressive declarative toolkit for composing predicates in TypeScript or JavaScript

```js
import p from "pdsl";

const isSoftwareCreator = p`{
  name: string,
  age: > 16,
  occupation: "Engineer" | "Designer" | "Project Manager"
}`;

isSoftwareCreator(someone); // true | false
```

- [x] Intuitive
- [x] Expressive
- [x] Lightweight
- [x] No dependencies
- [x] Small bundle size
- [x] Fast

<br/>

[![Build Status](https://travis-ci.com/ryardley/pdsl.svg?branch=master)](https://travis-ci.com/ryardley/pdsl)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/pdsl.svg)
![npm](https://img.shields.io/npm/v/pdsl.svg)
[![codecov](https://codecov.io/gh/ryardley/pdsl/branch/master/graph/badge.svg)](https://codecov.io/gh/ryardley/pdsl)

## Predicate functions are just easier with PDSL

Creating predicate functions in JavaScript is often verbose, especially for checking the format of complex object types. We need predicate functions all the time when filtering an array, validating input, determining the type of an unknown object or creating guard conditions in TypeScript.

PDSL provides the developer a simple but powerful shorthand based on a combination of template strings and helper functions for defining predicate functions that makes it easy to understand intent. With `pdsl` we can easily visualize the expected input's structure and intent using it's intuitive predicate composition language.

## Documentation

[Read the docs](https://github.com/ryardley/pdsl/blob/master/README.md)
