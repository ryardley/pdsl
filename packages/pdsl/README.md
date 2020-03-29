<br/><br/><br/>

<p align="center">
  <img src="pdsl-logo.png" width="200" />
</p>

<h1 align="center">Predicate Domain Specific Language</h1>
<h4 align="center">
  <a href="https://pdsl.dev">Read the docs!</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</h4>
<br/><br/><br/>

[![Build Status](https://travis-ci.com/ryardley/pdsl.svg?branch=master)](https://travis-ci.com/ryardley/pdsl)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/pdsl.svg)
![npm](https://img.shields.io/npm/v/pdsl.svg)
[![codecov](https://codecov.io/gh/ryardley/pdsl/branch/master/graph/badge.svg)](https://codecov.io/gh/ryardley/pdsl)

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
- [x] Lightweight - under 6k!
- [x] No dependencies
- [x] Small bundle size
- [x] Fast

<br/>

## Documentation

[PDSL Documentation](https://pdsl.dev)
