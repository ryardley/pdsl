const { generator } = require("./generator");
const { grammar, tokens } = require("./grammar");

const link = grammar[tokens.PREDICATE_LOOKUP];
const not = grammar[tokens.NOT];
const or = grammar[tokens.OR];
const and = grammar[tokens.AND];
const obj = grammar[tokens.OBJ];
const symbol = grammar[tokens.IDENTIFIER];
const entry = grammar[tokens.ENTRY];

function stringifyAst(rpn) {
  return rpn.map(n => n.toString()).join(" ");
}

describe("generator", () => {
  [
    { rpn: [link("@{LINK:0}")], fns: [() => true], out: true },
    { rpn: [link("@{LINK:0}")], fns: [() => false], out: false },
    { rpn: [link("@{LINK:0}"), not("!")], fns: [() => false], out: true },
    {
      rpn: [link("@{LINK:0}"), link("@{LINK:1}"), or("||")],
      fns: [() => false, () => true],
      out: true
    },
    {
      rpn: [link("@{LINK:0}"), link("@{LINK:1}"), and("&&")],
      fns: [() => false, () => true],
      out: false
    },
    {
      rpn: [
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
      rpn: [symbol("name"), obj("{1")],
      fns: [],
      inp: { name: "foo" },
      out: true
    }
  ].forEach(({ rpn, skip, only, fns, inp, out }) => {
    const itFunc = skip ? it.skip : only ? it.only : it;

    itFunc(stringifyAst(rpn), () => {
      expect(generator(rpn, fns)(inp)).toBe(out);
    });
  });
});
