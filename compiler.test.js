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
  "!": 3,
  "&&": 2,
  "||": 1
};

function parser(input) {
  const peek = a => a[a.length - 1];
  const stack = [];
  const argsstack = [];

  return (
    input
      .reduce((output, token) => {
        // TODO: add array list
        // TODO: add object list
        // SEE example-shunting-yard-algo.csv

        // if its an operand push it to the output

        if (/(_E\d+|[a-zA-Z0-9_-]+)/g.test(token)) {
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

it("parses", () => {
  expect(parser(tokenizer("_E0 || _E1")).join(" ")).toEqual("_E0 _E1 ||");

  expect(parser(tokenizer("_E0 || _E1 && _E3")).join(" ")).toEqual(
    "_E0 _E1 _E3 && ||"
  );

  expect(parser(tokenizer("!_E0 || _E1 && _E3")).join(" ")).toEqual(
    "_E0 ! _E1 _E3 && ||"
  );

  expect(parser(tokenizer("!(_E0 || _E1) && _E3")).join(" ")).toEqual(
    "_E0 _E1 || ! _E3 &&"
  );
});
