const TOKENS = [
  `\\,`,
  `\\:`,
  `\\!`,
  `\\&\\&`,
  `\\|\\|`,
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
  "!": 4,
  "&&": 3,
  "||": 2,
  ":": 1
};

function parser(input) {
  const peek = a => a[a.length - 1];
  const isMultiArg = Array.isArray;
  const incrementMultiArgCount = a => a[1]++;
  const stack = [];

  return (
    input
      .reduce((output, token) => {
        if (/(_E\d+|[a-zA-Z0-9_-]+)/g.test(token)) {
          if (isMultiArg(peek(stack))) {
            incrementMultiArgCount(peek(stack));
          }
          output.push(token);
          return output;
        }

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

        if (token === "{") {
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

        if (token === "}") {
          while (!isMultiArg(peek(stack))) output.push(stack.pop());
          output.push(stack.pop().join(""));
          return output;
        }

        // TODO: can the brackets be joined with the logic for arrays or objects
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

module.exports = { parser, tokenizer, TOKENS };
