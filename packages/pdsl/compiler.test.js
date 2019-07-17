const { tokenizer, parser } = require("./compiler");

describe("tokenizer", () => {
  it("tokens", () => {
    expect(tokenizer("   {   name   :   _E0 && _E2 ,age:_E1}")).toEqual([
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

describe("parser", () => {
  [
    { input: "a||b", output: "a b ||" },
    { input: "a||b&&c", output: "a b c && ||" },
    { input: "!a||b&&c", output: "a ! b c && ||" },
    { input: "!(a||b)&&c", output: "a b || ! c &&" },
    {
      input: `
    [
      fee,
      fi,
      fo,
      fum,
      [
        i,
        smell,
        the,
        blood,
        [
          of,
          an,
          englishman
        ]
      ]
    ]`,
      output: "fee fi fo fum i smell the blood of an englishman [3 [5 [5"
    },
    {
      input: "[a,b,c,d]||e",
      output: "a b c d [4 e ||"
    },
    {
      input: "[a,b,[c||d,e]]&&f",
      output: "a b c d || e [2 [3 f &&"
    },
    {
      input: "{ name, age }",
      output: "name age {2"
    },
    {
      input: "{ name : a, age : b }",
      output: "name a : age b : {2"
    },
    {
      input: "{ name : [foo, bar], age : b }",
      output: "name foo bar [2 : age b : {2"
    },
    {
      input: "{ name : {foo:[1,2], bar}, age : b }",
      output: "name foo 1 2 [2 : bar {2 : age b : {2"
    }
  ].forEach(({ input, output, skip, only }) => {
    const itFunc = skip ? it.skip : only ? it.only : it;

    itFunc(`"${input}" -> "${output}"`, () => {
      expect(parser(tokenizer(input)).join(" ")).toEqual(output);
    });
  });
});

describe("assembler", () => {});
