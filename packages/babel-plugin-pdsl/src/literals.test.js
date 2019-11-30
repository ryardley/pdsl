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
    expect(generate(numericLiteral({ runtime: () => 3.1415 })).code).toBe(
      "3.1415"
    );
  });
});
describe("symbolLiteral", () => {
  test("foo", () => {
    expect(generate(symbolLiteral({ runtime: () => "foo" })).code).toBe(
      '"foo"'
    );
  });
});

describe("stringLiteral", () => {
  test("'foo'", () => {
    expect(generate(stringLiteral({ runtime: () => "foo" })).code).toBe(
      '"foo"'
    );
  });
});

describe("booleanLiteral", () => {
  test("true", () => {
    expect(generate(booleanLiteral({ runtime: () => true })).code).toBe("true");
  });

  test("false", () => {
    expect(generate(booleanLiteral({ runtime: () => false })).code).toBe(
      "false"
    );
  });
});

describe("predicateLiteral", () => {
  const predicateLiteralTests = [
    {
      name: "Email",
      input: tokens.EMAIL_REGX,
      expected: "helpers.regx(helpers.Email)"
    },
    {
      name: "{}",
      input: tokens.EMPTY_OBJ,
      expected: "helpers.deep({})"
    },
    {
      name: "[]",
      input: tokens.EMPTY_ARRAY,
      expected: "helpers.deep([])"
    },
    {
      name: '""',
      input: tokens.EMPTY_STRING_DOUBLE,
      expected: 'helpers.deep("")'
    },
    {
      name: "''",
      input: tokens.EMPTY_STRING_SINGLE,
      expected: 'helpers.deep("")'
    },
    {
      name: "Number",
      input: tokens.PRIM_NUMBER,
      expected: "helpers.prim(Number)"
    },
    {
      name: "number",
      input: tokens.PRIM_NUMBER_VAL,
      expected: "helpers.prim(Number)"
    },
    {
      name: "Object",
      input: tokens.PRIM_OBJECT,
      expected: "helpers.prim(Object)"
    },
    {
      name: "Array",
      input: tokens.PRIM_ARRAY,
      expected: "helpers.prim(Array)"
    },
    {
      name: "null",
      input: tokens.NULL,
      expected: "helpers.val(null)"
    },
    {
      name: "undefined",
      input: tokens.UNDEFINED,
      expected: "helpers.val(undefined)"
    },
    {
      name: "Boolean",
      input: tokens.PRIM_BOOLEAN_VAL,
      expected: "helpers.prim(Boolean)"
    },
    {
      name: "symbol",
      input: tokens.PRIM_SYMBOL_VAL,
      expected: "helpers.prim(Symbol)"
    },
    {
      name: "string",
      input: tokens.PRIM_STRING_VAL,
      expected: "helpers.prim(String)"
    },
    {
      name: "array",
      input: tokens.PRIM_ARRAY_VAL,
      expected: "helpers.prim(Array)"
    },
    {
      name: "boolean",
      input: tokens.PRIM_BOOLEAN,
      expected: "helpers.prim(Boolean)"
    },
    {
      name: "String",
      input: tokens.PRIM_STRING,
      expected: "helpers.prim(String)"
    },
    {
      name: "Symbol",
      input: tokens.PRIM_SYMBOL,
      expected: "helpers.prim(Symbol)"
    },
    {
      name: "Function",
      input: tokens.PRIM_FUNCTION,
      expected: "helpers.prim(Function)"
    },
    {
      name: "_",
      input: tokens.EXTANT_PREDICATE,
      expected: "helpers.extant"
    },
    {
      name: "*",
      input: tokens.WILDCARD_PREDICATE,
      expected: "helpers.wildcard"
    },
    {
      name: "!!",
      input: tokens.TRUTHY,
      expected: "helpers.truthy"
    },
    {
      name: "falsey",
      input: tokens.FALSY_KEYWORD,
      expected: "helpers.falsey"
    }
  ];

  const EXEMPTIONS = ["Xc", "Nc", "Lc", "Uc", "LUc"];

  // Test to ensure we have a test here for all new predicate literals
  Object.entries(grammar)
    .filter(([test, creator]) => {
      return (
        creator('"foo"').type === "PredicateLiteral" &&
        !EXEMPTIONS.includes(test)
      );
    })
    .map(([test]) => test)
    .forEach(test => {
      const hasTest =
        predicateLiteralTests.filter(t => t.input === test).length > 0;
      it(`Have test for ${test}`, () => {
        expect(hasTest).toBe(true);
      });
    });

  predicateLiteralTests.forEach(({ name, input, expected, only }) => {
    const testFn = only ? test.only : test;
    testFn(name, () => {
      const node = grammar[input]();
      const rpn = predicateLiteral(node);
      expect(generate(rpn).code).toBe(expected);
    });
  });
});
