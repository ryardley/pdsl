const { OPERATORS, IDENTIFIERS } = require("./config");

const operators = OPERATORS.reduce((out, op, index) => {
  out[op.token.replace(/\\/g, "")] = index;
  return out;
}, {});

const dynamicArityOperators = OPERATORS.reduce((out, op, index) => {
  if (op.arity === -1) {
    out[op.token.replace(/\\/g, "")] = index;
  }
  return out;
}, {});

const closingOperators = OPERATORS.reduce((out, op, index) => {
  if (op.closingToken) {
    out[op.closingToken.replace(/\\/g, "")] = index;
  }
  return out;
}, {});

const identRegEx = new RegExp(`(${IDENTIFIERS.map(o => o.token).join("|")})`);

const peek = a => a[a.length - 1];
const isDynArityToken = token => dynamicArityOperators[token];
const inDynArityOperator = stack => Array.isArray(peek(stack));
const incArgCount = stack => {
  if (inDynArityOperator(stack)) peek(stack)[1]++;
};

function parser(input) {
  const stack = [];

  return (
    input
      .reduce((output, token) => {
        // identifier and literals
        if (identRegEx.test(token)) {
          incArgCount(stack);
          output.push(token);
          return output;
        }

        // Operators
        if (token in operators) {
          // organise operator precedence
          while (
            operators[peek(stack)] &&
            operators[peek(stack)] > operators[token]
          ) {
            output.push(stack.pop());
          }

          // If we are in an argument list count this expression as an argument
          if (isDynArityToken(token)) {
            incArgCount(stack);
            stack.push([token, 0]);
            return output;
          }

          // isClosingDynArityToken
          if (closingOperators[token]) {
            while (!inDynArityOperator(stack)) output.push(stack.pop());
            output.push(stack.pop().join(""));
            return output;
          }

          // Argument separator is special
          if (token === ",") {
            while (!inDynArityOperator(stack)) output.push(stack.pop());
            return output;
          }

          stack.push(token);
          return output;
        }

        // Brackets are special as they deal specifically with precedence
        // if its a '(' push the bracket to the stack
        if (token === "(") {
          stack.push(token);
          return output;
        }

        // if its a ')' while the stack is not an open bracket pop the stack and push it to the output then pop the stack
        if (token === ")") {
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
