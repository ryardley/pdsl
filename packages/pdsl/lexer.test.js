const { lexer } = require("./lexer");

describe("lexer", () => {
  it("tokens", () => {
    expect(
      lexer("   {   name   :   @{LINK:0} && @{LINK:2} ,age:@{LINK:1}}")
    ).toEqual([
      "{",
      "name",
      ":",
      "@{LINK:0}",
      "&&",
      "@{LINK:2}",
      ",",
      "age",
      ":",
      "@{LINK:1}",
      "}"
    ]);
  });
});
