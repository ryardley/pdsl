---
menu: Guide
---

# String

generally you can simply use either double or single quotes to check for string equivalence `""`.

## Test for type string

You can test that you have a string by using the string type test

```js
p`string`("I am a string!"); // true
p`string`(1234); // false
```

## Test string length

You can test both the type and length of strings and arrays by using the length syntax:

```js
p`string[5]`("12345"); // true
p`string[5]`("1234"); // false
```

You can also have any numeric test to apply to the strings length.

```js
p`string[<5]`("1234"); // true
p`string[<5|>20]`("123456789012345678901"); // true
```

## Empty Strings

Checking for empty strings:

```js
p`''`(""); // true
p`""`(""); // true
p`""`("Not empty"); // false
```

## String literals

You can check for string literals.

```js
p`'Hello pdsl!'`("Hello pdsl!"); // true
p`"Hello pdsl!"`("Hello pdsl!"); // true
```

## Discriminated Unions

You can check a list of discriminated unions using the `|` operator.

```js
p`"Doctor" | "Lawyer" | "Dentist" | "Teacher"`("Doctor"); // true
p`"Doctor" | "Lawyer" | "Dentist" | "Teacher"`("Politician"); // false
```

## Escaping charachters

You can escape characters by using alternative quotes.

```js
p`"This string contains \`backticks\`"`("This string contains `backticks`"); // true
```
