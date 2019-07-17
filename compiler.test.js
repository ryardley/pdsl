const TOKENS = [
  `\\,`,
  `\\:`,
  `\\!`,
  `\\&\\&`,
  `\\|\\|`,
  `\\[`,
  `\\]`,
  `\\{`,
  `\\}`,
  `\\(`,
  `\\)`,
  `_E\\d+`,
  `[a-zA-Z0-9_-]+`
];

const rex = new RegExp(`(${TOKENS.join("|")})`, "g");

function tokenizer(input) {
  return input.match(rex);
}

const operators = {
  ":": 4,
  "!": 3,
  "&&": 2,
  "||": 1
};

function parser(input) {
  const peek = a => a[a.length - 1];
  const isMultiArg = Array.isArray;
  const incrementMultiArgCount = a => a[1]++;
  const stack = [];

  return (
    input
      .reduce((output, token) => {
        // console.log({
        //   output: output.join(" "),
        //   stack: stack.map(a => (Array.isArray(a) ? a.join("") : a)).join(" "),
        //   token
        // });
        // TODO: add array list
        // TODO: add object list
        // SEE example-shunting-yard-algo.csv

        // if its an operand push it to the output

        if (/(_E\d+|[a-zA-Z0-9_-]+)/g.test(token)) {
          if (isMultiArg(peek(stack))) {
            incrementMultiArgCount(peek(stack));
          }
          output.push(token);
          return output;
        }
        // if its an operator
        //   while there are operators on the stack and the stack operator's precedence is gt the token's precedence
        //     pop the operator off the stack an on to the output
        if (token in operators) {
          while (
            peek(stack) in operators &&
            operators[peek(stack)] > operators[token]
          ) {
            output.push(stack.pop());
          }
          stack.push(token);
          return output;
        }

        // start array
        if (token === "[" || token === "{") {
          if (isMultiArg(peek(stack))) {
            incrementMultiArgCount(peek(stack));
          }
          stack.push([token, 0]);
          return output;
        }

        if (token === ",") {
          while (!isMultiArg(peek(stack))) output.push(stack.pop());
          return output;
        }

        if (token === "]" || token === "}") {
          while (!isMultiArg(peek(stack))) output.push(stack.pop());
          output.push(stack.pop().join(""));
          return output;
        }

        // if its a '(' push the bracket to the stack
        if (token == "(") {
          stack.push(token);
          return output;
        }

        // if its a ')' while the stack is not an open bracket pop the stack and push it to the output then pop the stack
        if (token == ")") {
          while (peek(stack) !== "(") output.push(stack.pop());
          stack.pop();
          return output;
        }
      }, [])
      // add everything left on the stack in reverse order to the end of the output.
      .concat(stack.reverse())
  );
}

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
