---
menu: Guide
---

# Reference

| Operator                 | Description                      |
| ------------------------ | -------------------------------- |
| `&`                      | Boolean AND                      |
| `&&`                     | Boolean AND alternative          |
| `[1,2,3]`                | Array argument match             |
| `[? string, number ]`    | Array includes                   |
| `array`                  | Array type match                 |
| `array[4]`               | Array length match               |
| `Array<number>`          | Array type match                 |
| `1..100`                 | Number in range (incl)           |
| `1<<100`                 | Number in range (excl)           |
| `_`                      | Extant                           |
| `!`                      | Falsey                           |
| `>`                      | Greater than                     |
| `>=`                     | Greater than or equals           |
| `<`                      | Less than                        |
| `<=`                     | Less than or equals              |
| `!`                      | Boolean NOT                      |
| `{ prop: string }`       | Object                           |
| \|                       | Boolean OR                       |
| \|\|                     | Boolean OR alternative           |
| `string`                 | Value is String                  |
| `string[4]`              | String length match              |
| `number`                 | Value is Number                  |
| `Number`, `String`, etc. | JavaScript types to test against |
| `!!`                     | Truthy                           |
| `<- "We found an issue"` | Error validation                 |
| `*`                      | Wildcard (always true)           |
