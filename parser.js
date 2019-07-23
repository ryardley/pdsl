// This article really helped work this out:
// http://wcipeg.com/wiki/Shunting_yard_algorithm#Variadic_functions

const { grammar } = require("./grammar");

const peek = a => a[a.length - 1];

const grammers = Object.entries(grammar);

function toNode(token) {
  for (let i = 0; i < grammers.length; i++) {
    const [test, createNode] = grammers[i];
    const testPassed = new RegExp(`^${test}$`).test(token);
    if (testPassed) {
      return createNode(token);
    }
  }
}

function isOperator(node) {
  if (!node) return false;
  return node.type === "Operator";
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
function isVaradicFunctionClose(node) {
  if (!node) return false;
  return node.type === "VariableArityOperatorClose";
}

function isVaradicFunction(node) {
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
  const arity = [];
  const finalOut = input
    .map(toNode)
    .reduce((output, node) => {
      let type;
      let msg = [];
      // Operands
      if (isLiteral(node) || isPredicateLookup(node)) {
        type = "operand";
        // send to output
        output.push(node);

        return output;
      }

      if (isVaradicFunction(node)) {
        type = "varadic";
        stack.push(node);
        arity.push(1);
        return output;
      }

      if (isArgumentSeparator(node)) {
        type = "comma";
        while (!isVaradicFunction(peek(stack))) {
          output.push(stack.pop());
        }
        arity.push(arity.pop() + 1);
        return output;
      }

      if (isVaradicFunctionClose(node)) {
        type = "varadic-close";
        while (!isVaradicFunction(peek(stack))) {
          output.push(stack.pop());
        }
        const fn = stack.pop();
        fn.arity = arity.pop();
        output.push(fn);
        return output;
      }

      if (isOperator(node)) {
        type = "operator";
        while (
          stack.length > 0 &&
          !isPrecidenceOperator(peek(stack)) &&
          !(peek(stack).prec > node.prec)
        ) {
          msg.push(
            `flushing-stack: L:${stack.length}, not(:${!isPrecidenceOperator(
              peek(stack)
            )}`
          );
          output.push(stack.pop());
        }
        stack.push(node);
        return output;
      }

      if (isPrecidenceOperator(node)) {
        type = "precedence";
        stack.push(node);

        return output;
      }

      if (isPrecidenceOperatorClose(node)) {
        type = "precedence-close";
        while (!isPrecidenceOperator(peek(stack))) {
          output.push(stack.pop());
        }

        stack.pop();

        return output;
      }

      return output;
    }, [])
    .concat(stack.reverse());

  return finalOut;
}

module.exports = { parser };
