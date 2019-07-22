const operators = {
  "{": 6,
  "!": 5,
  "&&": 4,
  "||": 3,
  ":": 2
};

const dynamicArityOperators = { "{": true };

const peek = a => a[a.length - 1];
const isDynArityToken = token => dynamicArityOperators[token];
const inDynArityOperator = stack => Array.isArray(peek(stack));
const countAsArgument = stack => {
  if (inDynArityOperator(stack)) peek(stack)[1]++;
};

function parser(input) {
  const stack = [];

  return (
    input
      .reduce((output, token) => {
        if (/(_E\d+|[a-zA-Z0-9_-]+)/g.test(token)) {
          // If we are in an argument list count this arg
          countAsArgument(stack);
          output.push(token);
          return output;
        }

        if (token in operators) {
          // organise operator precedence
          while (
            operators[peek(stack)] &&
            operators[peek(stack)] > operators[token]
          ) {
            output.push(stack.pop());
          }

          if (isDynArityToken(token)) {
            // If we are in an argument list count this expression as an argument
            countAsArgument(stack);
            stack.push([token, 0]);
            return output;
          }

          stack.push(token);
          return output;
        }

        // these are not considered operators
        if (token === ",") {
          while (!inDynArityOperator(stack)) output.push(stack.pop());
          return output;
        }

        if (token === "}") {
          while (!inDynArityOperator(stack)) output.push(stack.pop());
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

module.exports = { parser };
