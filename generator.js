const { not, and, or, obj, entry } = require("./helpers");
const { LINKAGES, OPERATORS } = require("./grammar");

const identifierRegEx = /[a-zA-Z]/;
const operatorLookup = OPERATORS.reduce((acc, op) => {
  if (op.arity > -1) {
    acc[op.token.replace(/\\/g, "")] = op;
  }
  return acc;
}, {});

const dynOps = OPERATORS.filter(op => op.arity === -1).map(op => {
  op.test = t => new RegExp(`^${op.token}`).test(t);
  return op;
});

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

    // Little tough because I am trying to efficient
    let arity;
    let op = operatorLookup[token];
    if (!op) {
      // TODO: maybe there is a better way here regarding regex test
      for (let i = 0; i < dynOps.length; i++) {
        const opd = dynOps[i];
        if (opd.test(token)) {
          op = opd;
          arity = opd.extract(token);
        }
      }
    } else {
      arity = op.arity;
    }
    let helper = op.helper;

    const args = stack.splice(-1 * arity).reverse();
    stack.push(helper(...args));
    return stack;
  }, []);

  return runnable;
}

module.exports = { generator };
