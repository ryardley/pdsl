const {
  Email,
  Xc,
  Nc,
  Lc,
  Uc,
  LUc,
  obj,
  entry,
  not,
  and,
  regx,
  deep,
  prim,
  val,
  or,
  gt,
  gte,
  holds,
  lt,
  lte,
  btw
} = require("./helpers");
const tokens = {
  NOT: "\\!",
  AND: "\\&\\&",
  OR: "\\|\\|",
  BTW: "\\<\\s\\<",
  GT: "\\>",
  GTE: "\\>\\=",
  LT: "\\<",
  LTE: "\\<\\=",
  ENTRY: "\\:",
  OBJ: "\\{",
  OBJ_CLOSE: "\\}",
  HOLDS: "\\[",
  HOLDS_CLOSE: "\\]",
  ARG: "\\,",
  SYMBOL: "[a-zA-Z_]+[a-zA-Z0-9_-]*",
  NUMBER: "-?\\d+\\.?\\d*",
  TRUE: "true",
  FALSE: "false",
  NULL: "null",
  UNDEFINED: "undefined",
  EMAIL_REGX: "Email",
  EXTENDED_CHARS_REGX: "Xc",
  NUM_CHARS_REGX: "Nc",
  LOW_CHARS_REGX: "Lc",
  UP_CHARS_REGX: "Uc",
  LOW_UP_CHARS_REGX: "LUc",
  EMPTY_OBJ: "\\{\\}",
  EMPTY_ARRAY: "\\[\\]",
  EMPTY_STRING_DOUBLE: `\\"\\"`,
  EMPTY_STRING_SINGLE: "\\'\\'",
  PRIM_NUMBER: "Number",
  PRIM_OBJECT: "Object",
  PRIM_ARRAY: "Array",
  PRIM_BOOLEAN: "Boolean",
  PRIM_STRING: "String",
  PRIM_BIG_INT: "BigInt",
  PRIM_SYMBOL: "Symbol",
  PRIM_FUNCTION: "Function",
  STRING_DOUBLE: `\\"[^\\"]*\\"`,
  STRING_SINGLE: `\\'[^\\']*\\'`,
  PREDICATE_LOOKUP: "@{LINK:(\\d+)}",
  PRECEDENCE: "\\(",
  PRECEDENCE_CLOSE: "\\)"
};
const grammar = {
  // LITERALS
  [tokens.TRUE]: token => ({
    type: "BooleanLiteral",
    token: token === "true",
    toString() {
      return token;
    }
  }),
  [tokens.FALSE]: token => ({
    type: "BooleanLiteral",
    token: token === "false",
    toString() {
      return token;
    }
  }),
  [tokens.FALSE]: token => ({
    type: "BooleanLiteral",
    token: token === "false",
    toString() {
      return token;
    }
  }),
  [tokens.EMAIL_REGX]: () => ({
    type: "PredicateLiteral",
    token: regx(Email),
    toString() {
      return "Email";
    }
  }),
  [tokens.EXTENDED_CHARS_REGX]: () => ({
    type: "PredicateLiteral",
    token: regx(Xc),
    toString() {
      return "Xc";
    }
  }),
  [tokens.NUM_CHARS_REGX]: () => ({
    type: "PredicateLiteral",
    token: regx(Nc),
    toString() {
      return "Nc";
    }
  }),
  [tokens.LOW_CHARS_REGX]: () => ({
    type: "PredicateLiteral",
    token: regx(Lc),
    toString() {
      return "Lc";
    }
  }),
  [tokens.UP_CHARS_REGX]: () => ({
    type: "PredicateLiteral",
    token: regx(Uc),
    toString() {
      return "Uc";
    }
  }),
  [tokens.LOW_UP_CHARS_REGX]: () => ({
    type: "PredicateLiteral",
    token: regx(LUc),
    toString() {
      return "LUc";
    }
  }),
  [tokens.EMPTY_OBJ]: () => ({
    type: "PredicateLiteral",
    token: deep({}),
    toString() {
      return "{}";
    }
  }),
  [tokens.EMPTY_ARRAY]: () => ({
    type: "PredicateLiteral",
    token: deep([]),
    toString() {
      return "[]";
    }
  }),
  [tokens.EMPTY_STRING_DOUBLE]: () => ({
    type: "PredicateLiteral",
    token: deep(""),
    toString() {
      return `""`;
    }
  }),
  [tokens.EMPTY_STRING_SINGLE]: () => ({
    type: "PredicateLiteral",
    token: deep(""),
    toString() {
      return `""`;
    }
  }),
  [tokens.PRIM_NUMBER]: token => ({
    type: "PredicateLiteral",
    token: prim(Number),
    toString() {
      return "Number";
    }
  }),
  [tokens.PRIM_OBJECT]: token => ({
    type: "PredicateLiteral",
    token: prim(Object),
    toString() {
      return "Object";
    }
  }),
  [tokens.PRIM_ARRAY]: token => ({
    type: "PredicateLiteral",
    token: prim(Array),
    toString() {
      return "Array";
    }
  }),
  [tokens.NULL]: () => ({
    type: "PredicateLiteral",
    token: val(null),
    toString() {
      return "null";
    }
  }),
  [tokens.UNDEFINED]: () => ({
    type: "PredicateLiteral",
    token: val(undefined),
    toString() {
      return "undefined";
    }
  }),
  [tokens.PRIM_BOOLEAN]: token => ({
    type: "PredicateLiteral",
    token: prim(Boolean),
    toString() {
      return "Boolean";
    }
  }),
  [tokens.PRIM_STRING]: token => ({
    type: "PredicateLiteral",
    token: prim(String),
    toString() {
      return "String";
    }
  }),
  [tokens.PRIM_BIG_INT]: token => ({
    type: "PredicateLiteral",
    token: prim(BigInt),
    toString() {
      return "BigInt";
    }
  }),
  [tokens.PRIM_SYMBOL]: token => ({
    type: "PredicateLiteral",
    token: prim(Symbol),
    toString() {
      return "Symbol";
    }
  }),
  [tokens.PRIM_FUNCTION]: token => ({
    type: "PredicateLiteral",
    token: prim(Function),
    toString() {
      return "Function";
    }
  }),
  [tokens.SYMBOL]: token => ({
    type: "SymbolLiteral",
    token,
    toString() {
      return token;
    }
  }),
  [tokens.NUMBER]: token => ({
    type: "NumericLiteral",
    token: Number(token),
    toString() {
      return token;
    }
  }),
  [tokens.STRING_DOUBLE]: token => ({
    type: "StringLiteral",
    token: token.match(/\"(.*)\"/)[1],
    toString() {
      return token;
    }
  }),
  [tokens.STRING_SINGLE]: token => ({
    type: "StringLiteral",
    token: token.match(/\'(.*)\'/)[1],
    toString() {
      return token;
    }
  }),
  [tokens.PREDICATE_LOOKUP]: token => {
    return {
      type: "PredicateLookup",
      token: token.match(/@{LINK:(\d+)}/)[1],
      toString() {
        return token;
      }
    };
  },

  // OPERATORS

  [tokens.NOT]: token => ({
    type: "Operator",
    token,
    arity: 1,
    runtime: not,
    toString() {
      return token;
    },
    prec: 10
  }),
  [tokens.AND]: token => ({
    type: "Operator",
    token,
    arity: 2,
    runtime: and,
    prec: 20,
    toString() {
      return token;
    }
  }),

  [tokens.OR]: token => ({
    type: "Operator",
    token,
    arity: 2,
    runtime: or,
    prec: 30,
    toString() {
      return token;
    }
  }),
  [tokens.BTW]: token => ({
    type: "Operator",
    token,
    arity: 2,
    runtime: btw,
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.GTE]: token => ({
    type: "Operator",
    token,
    arity: 1,
    runtime: gte,
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.LTE]: token => ({
    type: "Operator",
    token,
    arity: 1,
    runtime: lte,
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.GT]: token => ({
    type: "Operator",
    token,
    arity: 1,
    runtime: gt,
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.LT]: token => ({
    type: "Operator",
    token,
    arity: 1,
    runtime: lt,
    prec: 50,
    toString() {
      return token;
    }
  }),

  // functions have highest precidence
  [tokens.ENTRY]: token => ({
    type: "Operator",
    token,
    arity: 2,
    runtime: entry,
    prec: 100,
    toString() {
      return token;
    }
  }),

  [tokens.OBJ]: token => ({
    type: "VariableArityOperator",
    token,
    arity: 0,
    runtime: obj,
    prec: 100,
    toString() {
      return token + this.arity;
    }
  }),

  [tokens.OBJ_CLOSE]: token => ({
    type: "VariableArityOperatorClose",
    token,
    matchingToken: "{",
    toString() {
      return token;
    }
  }),

  [tokens.HOLDS]: token => ({
    type: "VariableArityOperator",
    token,
    arity: 0,
    runtime: holds,
    prec: 100,
    toString() {
      return token + this.arity;
    }
  }),

  [tokens.HOLDS_CLOSE]: token => ({
    type: "VariableArityOperatorClose",
    token,
    matchingToken: "[",
    toString() {
      return token;
    }
  }),

  [tokens.ARG]: token => ({
    type: "ArgumentSeparator",
    token,
    toString() {
      return token;
    }
  }),

  [tokens.PRECEDENCE]: token => ({
    type: "PrecidenceOperator",
    token,
    toString() {
      return token;
    }
  }),
  [tokens.PRECEDENCE_CLOSE]: token => ({
    type: "PrecidenceOperatorClose",
    token,
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
    {
      NumericLiteral: 1,
      StringLiteral: 1,
      SymbolLiteral: 1,
      BooleanLiteral: 1,
      PredicateLiteral: 1
    }[node.type] || false
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
  tokens,
  isPrecidenceOperatorClose,
  isPrecidenceOperator,
  isArgumentSeparator,
  isVaradicFunction,
  isVaradicFunctionClose,
  isPredicateLookup,
  isLiteral,
  isOperator
};
