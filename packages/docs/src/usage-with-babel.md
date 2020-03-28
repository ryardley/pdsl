---
menu: Integrations
name: Precompiling with Babel
---

# Precompiling with Babel

PDSL comes with a [babel plugin](https://github.com/ryardley/pdsl/tree/monorepo/packages/babel-plugin-pdsl).

This plugin speeds up [`pdsl`](https://github.com/ryardley/pdsl) in babelified codebases by pre-compiling p-expressions to predicate function definitions.

```bash
yarn add --dev @pdsl/babel-plugin-pdsl
```

You should ensure it is placed before any plugins that affect module import syntax.

```js
{
  plugins: ["@pdsl/babel-plugin-pdsl"];
}
```

## How precompiling works

Conceptually this plugin parses p-expressions and replaces them with function chains:

Example Input:

```js
import p from "pdsl";

const notNil = p`!(null|undefined)`;
const hasName = p`{name}`;
const isTrue = p`true`;
const hasNameWithFn = p`{name:${a => a.length > 10}}`;
```

Example Output

```js
import { val, not, or, obj, entry, pred } from "pdsl/helpers";

const notNil = val(not(or(val(null), val(undefined))));
const hasName = val(obj("name"));
const isTrue = val(true);
const hasNameWithFn = val(
  obj(
    entry(
      "name",
      pred(a => a.length > 10)
    )
  )
);
```
