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

# Documentation

* [PDSL](packages/pdsl)
* [PDSL Babel Plugin](packages/babel-plugin-pdsl)


## Roadmap

Help organise our priorities by [telling us what is the most important to you](https://github.com/ryardley/pdsl/issues/new)

- [x] Basic Laanaguage Design
- [x] PDSL Compiler
- [x] Comprehensive Test cases
- [x] Babel Plugin to remove compiler perf overhead
- [ ] Validation errors
- [ ] Syntax Highlighting VSCode and others
- [ ] Get Prettier to format the syntax on save
- [ ] VSCode Autocomplete

## Disclaimer

This should work however this project is young and there is a chance you may find bugs that are not covered by our test suite. Not all safety checks are in place and you may find issues around this.

Please help this open source project by [creating issues](https://github.com/ryardley/pdsl/issues/new).

Pull requests appreciated! [Feel free to help with open issues](https://github.com/ryardley/pdsl/issues).

This Syntax is DRAFT and we are open for [RFCs on the syntax](https://github.com/ryardley/pdsl/issues/new).

All feedback welcome. If you want to be a maintainer [create a pull request](https://github.com/ryardley/pdsl/pulls)

## FAQ

#### What does pdsl stand for?

Predicate Domain Specific Language.

#### Why did you write this?

@ryardley had a need for it when filtering on events in an app working with [ts-bus](https://github.com/ryardley/ts-bus). He also wanted to learn how to create a compiler from scratch.

#### Why would I ever use this?

We think PDSL is a great addition to working with predicates in JavaScript and hope you feel that way too. If there is something stopping you from wanting to use this in your projects we would like to know so [let us know about it here](https://github.com/ryardley/pdsl/issues/new) - perhaps we can fix your problem or prioritize it in our roadmap!

We don't know what's in your head and we want to make libraries that help more people get the most out of programming.

#### How does this work?

It is comprised of a [grammar](grammar.js), a [lexer](lexer.js) a [parser](parser.js) and a [code generator](generator.js). It uses a version of the [shunting yard algorhythm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm) to create the basic parser storing the output in [RPN](https://en.wikipedia.org/wiki/Reverse_Polish_notation) but using objects in an array instead of a tree. Then parsing was added for Varadic Functions. A lot of it was by trial and error.

There are better ways to do it. There are [plans to refactor to use a transducer pattern](https://github.com/ryardley/pdsl/issues/33) but there is also a plan to create a babel plugin which will [remove the need for compiler performance enhancement](https://github.com/ryardley/pdsl/issues/32). Nevertheless if you have tips and know how to do it better, faster, stronger or smaller, retaining semantic flexability and with no dependencies - we want to learn - [let us know about it here](https://github.com/ryardley/pdsl/issues/new)
