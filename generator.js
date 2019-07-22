const { not, and, or, obj, entry } = require("./helpers");

const identifierRegEx = /[a-zA-Z]/;
const isOperand = token => /^_E/.test(token);
const isIdentifier = token => identifierRegEx.test(token);

function generator(rpn, funcs) {
  const toFunc = token => {
    const index = token.match(/^_E(\d+)/)[1];
    return funcs[index];
  };

  const [runnable] = rpn.reduce((stack, token) => {
    if (isOperand(token)) {
      stack.push(toFunc(token));
    } else if (isIdentifier(token)) {
      stack.push(token);
    }

    if (token === "!") {
      stack.push(not(stack.pop()));
    }

    if (token === ":") {
      stack.push(entry(stack.pop(), stack.pop()));
    }

    if (token === "&&") {
      stack.push(and(stack.pop(), stack.pop()));
    }

    if (token === "||") {
      stack.push(or(stack.pop(), stack.pop()));
    }

    if (/^\{/.test(token)) {
      const count = parseInt(token.match(/^\{(\d+)/)[1]);
      const args = stack.splice(-1 * count);

      const objArgs = args.map(a => {
        return Array.isArray(a) ? a : [a, Boolean];
      });
      stack.push(obj(...objArgs));
    }

    return stack;
  }, []);

  return runnable;
}

module.exports = { generator };
