const {
  predicateLiteral,
  booleanLiteral,
  symbolLiteral,
  numericLiteral,
  stringLiteral
} = require("./literals");
const { grammar, tokens } = require("pdsl/grammar");
const generate = require("@babel/generator").default;

describe("numericLiteral", () => {
  test("3.1415", () => {
    expect(generate(numericLiteral({ token: 3.1415 })).code).toBe("3.1415");
  });
});
describe("symbolLiteral", () => {
  test("foo", () => {
    expect(generate(symbolLiteral({ token: "foo" })).code).toBe('"foo"');
  });
});

describe("stringLiteral", () => {
  test("'foo'", () => {
    expect(generate(stringLiteral({ token: "foo" })).code).toBe('"foo"');
  });
});

describe("booleanLiteral", () => {
  test("true", () => {
    expect(generate(booleanLiteral({ token: true })).code).toBe("true");
  });

  test("false", () => {
    expect(generate(booleanLiteral({ token: false })).code).toBe("false");
  });
});

describe("predicateLiteral", () => {
  [
    {
      name: "Email",
      input: tokens.EMAIL_REGX,
      expected: "regx(Email)"
    },
    {
      name: "{}",
      input: tokens.EMPTY_OBJ,
      expected: "deep({})"
    },
    {
      name: "[]",
      input: tokens.EMPTY_ARRAY,
      expected: "deep([])"
    },
    {
      name: '""',
      input: tokens.EMPTY_STRING_DOUBLE,
      expected: 'deep("")'
    },
    {
      name: "''",
      input: tokens.EMPTY_STRING_SINGLE,
      expected: 'deep("")'
    },
    {
      name: "Number",
      input: tokens.PRIM_NUMBER,
      expected: "prim(Number)"
    },
    {
      name: "number",
      input: tokens.PRIM_NUMBER_VAL,
      expected: "prim(Number)"
    },
    {
      name: "Object",
      input: tokens.PRIM_OBJECT,
      expected: "prim(Object)"
    },
    {
      name: "Array",
      input: tokens.PRIM_ARRAY,
      expected: "prim(Array)"
    },
    {
      name: "null",
      input: tokens.NULL,
      expected: "val(null)"
    },
    {
      name: "undefined",
      input: tokens.UNDEFINED,
      expected: "val(undefined)"
    },
    {
      name: "Boolean",
      input: tokens.PRIM_BOOLEAN_VAL,
      expected: "prim(Boolean)"
    },
    {
      name: "symbol",
      input: tokens.PRIM_SYMBOL_VAL,
      expected: "prim(Symbol)"
    },
    {
      name: "string",
      input: tokens.PRIM_STRING_VAL,
      expected: "prim(String)"
    },
    { name: "array", input: tokens.PRIM_ARRAY_VAL, expected: "prim(Array)" },
    { name: "boolean", input: tokens.PRIM_BOOLEAN, expected: "prim(Boolean)" },
    { name: "String", input: tokens.PRIM_STRING, expected: "prim(String)" },
    { name: "Symbol", input: tokens.PRIM_SYMBOL, expected: "prim(Symbol)" },
    {
      name: "Function",
      input: tokens.PRIM_FUNCTION,
      expected: "prim(Function)"
    }
  ].forEach(({ name, input, expected, only }) => {
    const testFn = only ? test.only : test;
    testFn(name, () => {
      const node = grammar[input]();
      const ast = predicateLiteral(node);
      expect(generate(ast).code).toBe(expected);
    });
  });
});
