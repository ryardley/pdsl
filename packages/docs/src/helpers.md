---
route: /helpers
---

# Helpers (experimental)

NOTE: This should be considered unsafe API for the time being as it may change.

PDSL provides a number of helpers that can be exported from the `pdsl/helpers` package and may be used standalone or as part of a `p` expression.

```js
import { Email, pred, btw, gt, regx } from "pdsl/helpers";

btw(1, 10)(20); // false
regx(/^foo/)("food"); // true
gt(100)(100); // false
gte(100)(100); // true
pred(9)(9); // true
pred(9)(10); // false
pred(Email)("hello@world.com"); // true
pred(Number)(1); // true
pred(String)("Hello"); // true
```

Available helpers:

| Helper        | Description                                 | PDSL Operator          |
| ------------- | ------------------------------------------- | ---------------------- |
| [and](#and)   | Logical AND                                 | `a & b` or `a && b`    |
| [btw](#btw)   | Between                                     | `10 < < 100`           |
| [btwe](#btwe) | Between or equals                           | `10..100`              |
| [deep](#deep) | Deep equality                               | N/A                    |
| [gt](#gt)     | Greater than                                | `> 5`                  |
| [gte](#gte)   | Greater than or equals                      | `>= 5`                 |
| [lt](#lt)     | Less than                                   | `< 5`                  |
| [lte](#lte)   | Less than equals                            | `<= 5`                 |
| [not](#not)   | Logical NOT                                 | `!6`                   |
| [or](#or)     | Logical OR                                  | `a \| b` or `a \|\| b` |
| [pred](#pred) | Select the correct predicate based on input | `${myVal}`             |
| [prim](#prim) | Primitive typeof checking                   | `Array` etc.           |
| [regx](#regx) | Regular expression predicate                | `${/^foo/}`            |
| [val](#val)   | Strict equality                             | N/A                    |
