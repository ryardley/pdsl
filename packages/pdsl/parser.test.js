const { parser } = require("./parser");
const { lexer } = require("./lexer");

function prepare(parserOut) {
  return parserOut.map(p => p.toString()).join(" ");
}

describe("parser", () => {
  [
    { input: "a||b", output: "a b ||" },
    { input: "a||b&&c", output: "a b c && ||" },
    { input: "!a||b&&c", output: "a !1 b c && ||" },
    { input: "!(a||b)&&c", output: "a b || !1 c &&" },
    {
      input: `
    {
      fee,
      fi,
      fo,
      fum,
      {
        i,
        smell,
        the,
        blood,
        {
          of,
          an,
          englishman
        }
      }
    }`,
      output: "fee fi fo fum i smell the blood of an englishman {3 {5 {5"
    },
    { input: "{ name , age }", output: "name age {2" },
    {
      input: "{ name : a, age : b }",
      output: "name a : age b : {2"
    },
    {
      // only: true,
      input: "{ name : {foo, bar}, age : b }",
      output: "name foo bar {2 : age b : {2"
    },
    {
      input: "{ name : {foo:{1,2}, bar}, age : b }",
      output: "name foo 1 2 {2 : bar {2 : age b : {2"
    },
    { input: "{ name : ! { bar } }", output: "name bar {1 !1 : {1" },
    {
      input: "a || { username : b , password : c && { length : d } }",
      output: "a username b : password c length d : {1 && : {2 ||"
    },
    { input: "{ age : > 5 }", output: "age 5 > : {1" },
    { input: "{ age : < 5 }", output: "age 5 < : {1" },
    { input: "10 < < 100", output: "10 100 < <" },
    { input: ">=100", output: "100 >=" },
    { input: "<=100", output: "100 <=" },
    { input: "!8", output: "8 !1" },
    { input: "{name: ! }", output: "name ! : {1" },
    { input: "{name: !! }", output: "name !! : {1" }
  ].forEach(({ input, output, skip, only }) => {
    const itFunc = skip ? it.skip : only ? it.only : it;

    itFunc(`"${input}" -> "${output}"`, () => {
      const actual = prepare(parser(lexer(input)));
      expect(actual).toEqual(output);
    });
  });
});
