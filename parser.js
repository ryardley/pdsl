// This article really helped work this out:
// http://wcipeg.com/wiki/Shunting_yard_algorithm#Variadic_functions

const DEBUG = false;

const {
  grammar,
  isPrecidenceOperatorClose,
  isPrecidenceOperator,
  isArgumentSeparator,
  isVaradicFunction,
  isVaradicFunctionClose,
  isPredicateLookup,
  isLiteral,
  isOperator
} = require("./grammar");

const peek = a => a[a.length - 1];

const grammers = Object.entries(grammar);

function astToString(ast) {
  return ast.map(a => a.toString()).join("·");
}

function debug(output, stack, node, type, msg) {
  if (DEBUG)
    console.log(
      [
        `token: ${node.token}`,
        `type: ${type}`,
        ...msg.map(m => ` msg:${m}`),
        `stack: ${astToString(stack)}`,
        `output: ${astToString(output)}`
      ].join("\n")
    );
  return output;
}

function toNode(token) {
  for (let i = 0; i < grammers.length; i++) {
    const [test, createNode] = grammers[i];
    const testPassed = new RegExp(`^${test}$`).test(token);
    if (testPassed) {
      return createNode(token);
    }
  }
}

function parser(input) {
  const stack = [];
  const arity = [];
  try {
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

          return debug(output, stack, node, type, msg);
        }

        if (isVaradicFunction(node)) {
          type = "varadic";
          stack.push(node);
          arity.push(1);
          return debug(output, stack, node, type, msg);
        }

        if (isArgumentSeparator(node)) {
          type = "comma";
          while (stack.length > 0 && !isVaradicFunction(peek(stack))) {
            output.push(stack.pop());
          }
          arity.push(arity.pop() + 1);
          return debug(output, stack, node, type, msg);
        }

        if (isVaradicFunctionClose(node)) {
          type = "varadic-close";
          while (stack.length > 0 && !isVaradicFunction(peek(stack))) {
            output.push(stack.pop());
          }

          const fn = stack.pop();

          fn.arity = arity.pop();
          output.push(fn);
          return debug(output, stack, node, type, msg);
        }

        if (isOperator(node)) {
          type = "operator";
          while (
            stack.length > 0 &&
            !isPrecidenceOperator(peek(stack)) &&
            !(peek(stack).prec >= node.prec)
          ) {
            if (peek(stack).prec > node.prec) {
              msg.push("Stack precedence is higher than node!");
            } else {
              msg.push("Stack precedence is equal or lower than node!");
            }
            msg.push("flushing stack");
            output.push(stack.pop());
          }
          stack.push(node);
          return debug(output, stack, node, type, msg);
        }

        if (isPrecidenceOperator(node)) {
          type = "precedence";
          stack.push(node);

          return debug(output, stack, node, type, msg);
        }

        if (isPrecidenceOperatorClose(node)) {
          type = "precedence-close";
          while (!isPrecidenceOperator(peek(stack))) {
            output.push(stack.pop());
          }

          stack.pop();

          return debug(output, stack, node, type, msg);
        }

        return debug(output, stack, node, type, msg);
      }, [])
      .concat(stack.reverse());

    return finalOut;
  } catch (e) {
    throw new Error(
      `Malformed Input! pdsl could not parse the tokenized input stream : ${input}`
    );
  }
}

module.exports = { parser };
