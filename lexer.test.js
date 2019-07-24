const { lexer } = require("./lexer");

describe("lexer", () => {
  it("should tokenize", () => {
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
  it("should strip comments", () => {
    expect(
      lexer(`{
        name: "Rudi", // foo
        // thing
        age
      }`)
    ).toEqual(["{", "name", ":", '"Rudi"', ",", "age", "}"]);
  });
});
