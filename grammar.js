const { obj, entry, not, and, or } = require("./helpers");

const grammar = {
  // OPERATORS
  ["\\:"]: token => ({
    type: "Operator",
    token,
    arity: 2,
    runtime: entry,
    prec: 18,
    toString() {
      return token;
    }
  }),
  ["\\!"]: token => ({
    type: "Operator",
    token,
    arity: 1,
    runtime: not,
    toString() {
      return token;
    },
    prec: 16
  }),
  ["\\}"]: token => ({
    type: "VariableArityOperatorClose",
    token,
    matchingToken: "{",
    toString() {
      return token;
    },
    prec: 19
  }),
  ["\\,"]: token => ({
    type: "ArgumentSeparator",
    token,
    toString() {
      return token;
    },
    prec: 19
  }),

  ["\\&\\&"]: token => ({
    type: "Operator",
    token,
    arity: 2,
    runtime: and,
    prec: 17,
    toString() {
      return token;
    }
  }),
  ["\\|\\|"]: token => ({
    type: "Operator",
    token,
    arity: 2,
    runtime: or,
    prec: 18,
    toString() {
      return token;
    }
  }),
  ["\\{"]: token => ({
    type: "VariableArityOperator",
    token,
    arity: 0,
    runtime: obj,
    prec: 19,
    toString() {
      return token + this.arity;
    }
  }),

  // LITERALS
  ["[a-zA-Z0-9_-]+"]: token => ({
    type: "SymbolLiteral",
    token,
    toString() {
      return token;
    }
  }),
  ["\\d+\\.?\\d*"]: token => ({
    type: "NumericLiteral",
    token: Number(token),
    toString() {
      return token;
    }
  }),
  [`\\"[^\\"]*\\"`]: token => ({
    type: "StringLiteral",
    token: token.match(/\"(.*)\"/)[1],
    toString() {
      return token;
    }
  }),
  ["\\'[^\\']*\\'"]: token => ({
    type: "StringLiteral",
    token: token.match(/\'(.*)\'/)[1],
    toString() {
      return token;
    }
  }),
  ["@{LINK:(\\d+)}"]: token => {
    return {
      type: "PredicateLookup",
      token: token.match(/@{LINK:(\d+)}/)[1],
      toString() {
        return token;
      }
    };
  },
  ["\\("]: token => ({
    type: "PrecidenceOperator",
    token,
    prec: 20,
    toString() {
      return token;
    }
  }),
  ["\\)"]: token => ({
    type: "PrecidenceOperatorClose",
    token,
    prec: 20,
    toString() {
      return token;
    }
  })
};

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
  return node.type === "PredicateLookup";
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
module.exports = {
  grammar,
  isPrecidenceOperatorClose,
  isPrecidenceOperator,
  isArgumentSeparator,
  isVaradicFunction,
  isVaradicFunctionClose,
  isPredicateLookup,
  isLiteral,
  isOperator
};
