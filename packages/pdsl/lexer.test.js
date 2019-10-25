const { lexer } = require("./lexer");
const { tokens, grammar } = require("./grammar");
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

  it("should differentiate between ! as a unary operator and as a predicate", () => {
    expect(JSON.stringify(lexer(`{ name: ! }`))).toEqual(
      JSON.stringify([
        grammar[tokens.OBJ]("{"),
        grammar[tokens.SYMBOL]("name"),
        grammar[tokens.ENTRY](":"),
        grammar[tokens.FALSY]("!"),
        grammar[tokens.OBJ_CLOSE]("}")
      ])
    );
  });
});
