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
  { input: "_E0 || _E1", output: "_E0 _E1 ||" },
  { input: "_E0 || _E1 && _E3", output: "_E0 _E1 _E3 && ||" },
  { input: "!_E0 || _E1 && _E3", output: "_E0 ! _E1 _E3 && ||" },
  { input: "!(_E0 || _E1) && _E3", output: "_E0 _E1 || ! _E3 &&" },
  {
    input: "[ _E0 , _E1 , _E2 , _E3 ] || _E4",
    output: "_E0 _E1 _E2 _E3 [4 _E4 ||"
  },
  {
    input: "[ _E0, _E1, [ _E2 || _E3, _E4 ] ] && _E5",
    output: "_E0 _E1 _E2 _E3 || _E4 [2 [3 _E5 &&"
  },
  {
    input: "{ name, age }",
    output: "name age {2"
  },
  {
    input: "{ name : _E0, age : _E1 }",
    output: "name _E0 : age _E1 : {2"
  }
].forEach(({ input, output, skip, only }) => {
  const itFunc = skip ? it.skip : only ? it.only : it;

  itFunc(input, () => {
    expect(parser(tokenizer(input)).join(" ")).toEqual(output);
  });
});
