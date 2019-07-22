const { generator } = require("./generator");

describe("generator", () => {
  [
    { ast: "@{LINK:0}", fns: [() => true], out: true },
    { ast: "@{LINK:0}", fns: [() => false], out: false },
    { ast: "@{LINK:0} !", fns: [() => false], out: true },
    {
      ast: "@{LINK:0} @{LINK:1} ||",
      fns: [() => false, () => true],
      out: true
    },
    {
      ast: "@{LINK:0} @{LINK:1} &&",
      fns: [() => false, () => true],
      out: false
    },
    {
      ast: "name @{LINK:0} : age @{LINK:1} : {2",
      fns: [a => a === "foo", a => a === 41],
      inp: { name: "foo", thing: "asd", age: 41 },
      out: true
    },
    {
      ast: "name {1",
      fns: [],
      inp: { name: "foo" },
      out: true
    }
  ].forEach(({ ast, skip, only, fns, inp, out }) => {
    const itFunc = skip ? it.skip : only ? it.only : it;

    itFunc(ast, () => {
      expect(generator(ast.split(" "), fns)(inp)).toBe(out);
    });
  });
});
