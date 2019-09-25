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

# Read the docs!

* [pdsl docs](packages/pdsl)
* [babel-plugin-pdsl docs](packages/babel-plugin-pdsl)
