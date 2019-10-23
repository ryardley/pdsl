const { generator } = require("./generator");
const { grammar, tokens } = require("./grammar");

const link = grammar[tokens.PREDICATE_LOOKUP];
const not = grammar[tokens.NOT];
const or = grammar[tokens.OR];
const and = grammar[tokens.AND];
const obj = grammar[tokens.OBJ];
const symbol = grammar[tokens.SYMBOL];
const entry = grammar[tokens.ENTRY];

function stringifyAst(ast) {
  return ast.map(n => n.toString()).join(" ");
}

describe("generator", () => {
  [
    { ast: [link("@{LINK:0}")], fns: [() => true], out: true },
    { ast: [link("@{LINK:0}")], fns: [() => false], out: false },
    { ast: [link("@{LINK:0}"), not("!")], fns: [() => false], out: true },
    {
      ast: [link("@{LINK:0}"), link("@{LINK:1}"), or("||")],
      fns: [() => false, () => true],
      out: true
    },
    {
      ast: [link("@{LINK:0}"), link("@{LINK:1}"), and("&&")],
      fns: [() => false, () => true],
      out: false
    },
    {
      ast: [
        symbol("name"),
        link("@{LINK:0}"),
        entry(":"),
        symbol("age"),
        link("@{LINK:1}"),
        entry(":"),
        obj("{2")
      ],
      fns: [a => a === "foo", a => a === 41],
      inp: { name: "foo", age: 41 },
      out: true
    },
    {
      ast: [symbol("name"), obj("{1")],
      fns: [],
      inp: { name: "foo" },
      out: true
    }
  ].forEach(({ ast, skip, only, fns, inp, out }) => {
    const itFunc = skip ? it.skip : only ? it.only : it;

    itFunc(stringifyAst(ast), () => {
      expect(generator(ast, fns)(inp)).toBe(out);
    });
  });
});
