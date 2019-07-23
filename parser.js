const grammer = require("./grammar");

const peek = a => a[a.length - 1];

const grammers = Object.entries(grammer);

const mylog = (level, ...args) => level && console.log(...args);

function toNode(token) {
  for (let i = 0; i < grammers.length; i++) {
    const [test, createNode] = grammers[i];

    const testPassed = new RegExp(`^${test}$`).test(token);
    // mylog(false, { test, testPassed });
    if (testPassed) {
      // mylog(false, { test, token });
      return createNode(token);
    }
  }
}

function isOperator(node) {
  if (!node) return false;
  return (
    {
      VariableArityOperator: 1,
      VariableArityOperatorClose: 1,
      Operator: 1,
      ArgumentSeparator: 1
    }[node.type] || false
  );
}

function isLiteral(node) {
  if (!node) return false;
  return (
    { NumericLiteral: 1, StringLiteral: 1, SymbolLiteral: 1 }[node.type] ||
    false
  );
}
function isPredicateLookup(node) {
  if (!node) return false;
  return { PredicateLookup: 1 }[node.type] || false;
}
function isVariableArityOperatorClose(node) {
  if (!node) return false;
  return node.type === "VariableArityOperatorClose";
}

function isVariableArityOperator(node) {
  if (!node) return false;
  return node.type === "VariableArityOperator";
}

function isArgumentSeparator(node) {
  if (!node) return false;
  return node.type === "ArgumentSeparator";
}
function isPrecidenceOperator(node) {
  if (!node) return false;
  return node.type === "PrecidenceOperator";
}

function isPrecidenceOperatorClose(node) {
  if (!node) return false;
  return node.type === "PrecidenceOperatorClose";
}

function parser(input) {
  const stack = [];

  return (
    input
      .map(toNode)
      .reduce((output, node) => {
        // Literals
        if (isLiteral(node) || isPredicateLookup(node)) {
          // increase arg count in VariableArityOperator
          const stackTop = peek(stack);
          if (isVariableArityOperator(stackTop)) stackTop.arity++;

          // send to output
          output.push(node);

          return output;
        }

        if (isOperator(node)) {
          while (isOperator(peek(stack)) && peek(stack).prec > node.prec) {
            output.push(stack.pop());
          }

          if (isVariableArityOperator(node)) {
            // increase arg count in VariableArityOperator

            const stackTop = peek(stack);
            if (isVariableArityOperator(stackTop)) {
              stackTop.arity++;
            }

            // send to stack
            stack.push(node);

            return output;
          }

          if (isVariableArityOperatorClose(node)) {
            // drain stack until variable arity operator

            while (!isVariableArityOperator(peek(stack))) {
              output.push(stack.pop());
            }
            // send operator to the output
            output.push(stack.pop());

            return output;
          }

          if (isArgumentSeparator(node)) {
            while (!isVariableArityOperator(peek(stack))) {
              output.push(stack.pop());
            }

            return output;
          }
          stack.push(node);

          return output;
        }

        if (isPrecidenceOperator(node)) {
          stack.push(node);

          return output;
        }

        if (isPrecidenceOperatorClose(node)) {
          while (!isPrecidenceOperator(peek(stack))) {
            output.push(stack.pop());
          }
          stack.pop();

          return output;
        }
        return output;
      }, [])
      // add everything left on the stack in reverse order to the end of the output.
      .concat(stack.reverse())
  );
}

module.exports = { parser };
