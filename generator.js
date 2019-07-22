const { not, and, or, obj, entry } = require("./helpers");
const { LINKAGES } = require("./grammar");

const identifierRegEx = /[a-zA-Z]/;

const [links] = LINKAGES;

const linkRegExp = new RegExp(links.token);

const isLinkSymbol = token => {
  return linkRegExp.test(token);
};

const lookupLinkSymbol = (token, funcs) => {
  const index = links.extract(token);
  return funcs[index];
};

const isLiteral = token => identifierRegEx.test(token);

function generator(rpn, funcs) {
  const [runnable] = rpn.reduce((stack, token) => {
    if (isLinkSymbol(token)) {
      stack.push(lookupLinkSymbol(token, funcs));
      return stack;
    }

    if (isLiteral(token)) {
      stack.push(token);
      return stack;
    }

    if (token === "!") {
      stack.push(not(stack.pop()));
      return stack;
    }

    if (token === ":") {
      stack.push(entry(stack.pop(), stack.pop()));
      return stack;
    }

    if (token === "&&") {
      stack.push(and(stack.pop(), stack.pop()));
      return stack;
    }

    if (token === "||") {
      stack.push(or(stack.pop(), stack.pop()));
      return stack;
    }

    if (/^\{/.test(token)) {
      const count = parseInt(token.match(/^\{(\d+)/)[1]);
      const args = stack.splice(-1 * count);
      stack.push(obj(...args));
      return stack;
    }

    return stack;
  }, []);

  return runnable;
}

module.exports = { generator };
