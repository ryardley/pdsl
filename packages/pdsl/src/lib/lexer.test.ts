import { lexer } from "./lexer";
import { tokens, grammar } from "./grammar";
import { rpnToString } from "./utils";

describe("lexer", () => {
  it("should tokenize", () => {
    expect(
      rpnToString(
        lexer("   {   name   :   @{LINK:0} && @{LINK:2} ,age:@{LINK:1}}")
      )
    ).toEqual("{0·name·:·@{LINK:0}·&&·@{LINK:2}·,·age·:·@{LINK:1}·}");
  });
  it("should strip comments", () => {
    expect(
      rpnToString(
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
        grammar[tokens.IDENTIFIER]("name"),
        grammar[tokens.ENTRY](":"),
        grammar[tokens.FALSY_KEYWORD]("!"),
        grammar[tokens.OBJ_CLOSE]("}")
      ])
    );
  });
});
