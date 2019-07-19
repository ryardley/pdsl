const { generator, generateObjectPredicate } = require("./generator");

describe("generateComplexPredicates", () => {
  it("object predicate", () => {
    const p = generateObjectPredicate(
      ["name", a => a === "foo"],
      ["age", a => a === 41]
    );
    expect(p({ name: "foo", age: 41 })).toBe(true);
  });
});

describe("generator", () => {
  [
    { ast: "_E0", fns: [() => true], out: true },
    { ast: "_E0", fns: [() => false], out: false },
    { ast: "_E0 !", fns: [() => false], out: true },
    { ast: "_E0 _E1 ||", fns: [() => false, () => true], out: true },
    { ast: "_E0 _E1 &&", fns: [() => false, () => true], out: false },
    {
      ast: "name _E0 : age _E1 : {2",
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
