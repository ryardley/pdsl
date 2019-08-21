# `@pdsl/babel-plugin-pdsl`

This plugin speeds up [`pdsl`](https://github.com/ryardley/pdsl) in babelified codebases by pre-compiling p-expressions to predicate function definitions.

## Prerequisites

Ensure you have [`pdsl`](https://github.com/ryardley/pdsl) installed in your project.

## Installation

Install the plugin with yarn or npm.

```bash
yarn add --dev @pdsl/babel-plugin-pdsl
```

```bash
npm install -D @pdsl/babel-plugin-pdsl
```

## Configuration

Add the plugin to your `.bablerc`:

```json
{
  "plugins": ["@pdsl/babel-plugin-pdsl"]
}
```

_NOTE: Ensure the plugin is placed before any module resolution plugins._

## How this works

This plugin parses p-expressions and repaces them with function calls:

#### Input

```js
import p from "pdsl";

const notNil = p`!(null|undefined)`;
const hasName = p`{name}`;
const isTrue = p`true`;
const hasNameWithFn = p`{name:${a => a.length > 10}}`;
```

#### Output

```js
import { val, not, or, obj, entry, pred } from "pdsl/helpers";

const notNil = val(not(or(val(null), val(undefined))));
const hasName = val(obj("name"));
const isTrue = val(true);
const hasNameWithFn = val(obj(entry("name", pred(a => a.length > 10))));
```
