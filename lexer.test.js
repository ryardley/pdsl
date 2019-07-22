const { lexer } = require("./lexer");

describe("lexer", () => {
  it("tokens", () => {
    expect(lexer("   {   name   :   _E0 && _E2 ,age:_E1}")).toEqual([
      "{",
      "name",
      ":",
      "_E0",
      "&&",
      "_E2",
      ",",
      "age",
      ":",
      "_E1",
      "}"
    ]);
  });
});
