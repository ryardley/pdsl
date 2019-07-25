const { lexer } = require("./lexer");
const { astToString } = require("./utils");
describe("lexer", () => {
  it("should tokenize", () => {
    expect(
      astToString(
        lexer("   {   name   :   @{LINK:0} && @{LINK:2} ,age:@{LINK:1}}")
      )
    ).toEqual("{0·name·:·@{LINK:0}·&&·@{LINK:2}·,·age·:·@{LINK:1}·}");
  });
  it("should strip comments", () => {
    expect(
      astToString(
        lexer(`{
        name: "Rudi", // foo
        // thing
        age
      }`)
      )
    ).toEqual('{0·name·:·"Rudi"·,·age·}');
  });
});
