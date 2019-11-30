// This article really helped work this out:
// http://wcipeg.com/wiki/Shunting_yard_algorithm#Variadic_functions

const DEBUG = process && process.env && process.env.DEBUG;

const {
  isPrecidenceOperatorClose,
  isPrecidenceOperator,
  isArgumentSeparator,
  isVaradicFunction,
  isVaradicFunctionClose,
  isPredicateLookup,
  isLiteral,
  isOperator
} = require("./grammar");

const { debug } = require("./utils");

const peek = a => a[a.length - 1];

function parser(input) {
  const stack = [];
  const arity = [];
  try {
    const finalOut = input
      .reduce((output, node) => {
        let type;
        let msg = [];

        if (isLiteral(node) || isPredicateLookup(node)) {
          type = "operand";
          // send to output
          output.push(node);
        }

        if (isVaradicFunction(node)) {
          type = "varadic";
          stack.push(node);
          arity.push(1);
        }

        if (isArgumentSeparator(node)) {
          type = "comma";
          while (stack.length > 0 && !isVaradicFunction(peek(stack))) {
            output.push(stack.pop());
          }
          arity.push(arity.pop() + 1);
        }

        if (isVaradicFunctionClose(node)) {
          type = "varadic-close";
          while (stack.length > 0 && !isVaradicFunction(peek(stack))) {
            output.push(stack.pop());
          }

          const fn = stack.pop();

          fn.arity = arity.pop();
          output.push(fn);
        }

        if (isOperator(node)) {
          type = "operator";
          while (
            stack.length > 0 &&
            !isPrecidenceOperator(peek(stack)) &&
            !(peek(stack).prec >= node.prec)
          ) {
            msg.push("flushing stack");
            output.push(stack.pop());
          }
          stack.push(node);
        }

        if (isPrecidenceOperator(node)) {
          type = "precedence";
          stack.push(node);
        }

        if (isPrecidenceOperatorClose(node)) {
          type = "precedence-close";
          while (!isPrecidenceOperator(peek(stack))) {
            output.push(stack.pop());
          }

          stack.pop();
        }

        /* istanbul ignore next */
        if (DEBUG) debug(output, stack, node, type, msg);

        return output;
      }, [])
      .concat(stack.reverse());

    return finalOut;
  } catch (e) {
    throw new Error(
      `Malformed Input! pdsl could not parse the tokenized input stream : ${input.join(
        " "
      )}`
    );
  }
}

module.exports = { parser };
