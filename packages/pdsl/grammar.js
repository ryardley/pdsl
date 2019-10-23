const {
  and,
  btw,
  btwe,
  deep,
  Email,
  entry,
  gt,
  gte,
  holds,
  Lc,
  lt,
  lte,
  LUc,
  Nc,
  not,
  obj,
  or,
  prim,
  regx,
  falsey,
  truthy,
  Uc,
  val,
  Xc
} = require("./helpers");

const tokens = {
  NOT: "\\!",
  TRUTHY: "\\!\\!",
  FALSY_KEYWORD: "falsey", // Using literal falsey as if we use "\\!" it will be picked up all the not operators
  AND: "\\&\\&",
  OR: "\\|\\|",
  AND_SHORT: "\\&",
  OR_SHORT: "\\|",
  BTW: "\\<\\s\\<",
  BTWE: "\\.\\.",
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
  NUMBER: "-?\\d+(\\.\\d+)?",
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
  PRIM_NUMBER_VAL: "number",
  PRIM_BOOLEAN_VAL: "boolean",
  PRIM_SYMBOL_VAL: "symbol",
  PRIM_STRING_VAL: "string",
  PRIM_ARRAY_VAL: "array",
  PRIM_NUMBER: "Number",
  PRIM_OBJECT: "Object",
  PRIM_ARRAY: "Array",
  PRIM_BOOLEAN: "Boolean",
  PRIM_STRING: "String",
  PRIM_SYMBOL: "Symbol",
  PRIM_FUNCTION: "Function",
  STRING_DOUBLE: `\\"[^\\"]*\\"`,
  STRING_SINGLE: `\\'[^\\']*\\'`,
  PREDICATE_LOOKUP: "@{LINK:(\\d+)}",
  PRECEDENCE: "\\(",
  PRECEDENCE_CLOSE: "\\)"
};

const types = {
  BooleanLiteral: "BooleanLiteral",
  PredicateLiteral: "PredicateLiteral",
  SymbolLiteral: "SymbolLiteral",
  NumericLiteral: "NumericLiteral",
  StringLiteral: "StringLiteral",
  PredicateLookup: "PredicateLookup",
  Operator: "Operator",
  VariableArityOperator: "VariableArityOperator",
  VariableArityOperatorClose: "VariableArityOperatorClose",
  ArgumentSeparator: "ArgumentSeparator",
  PrecidenceOperator: "PrecidenceOperator",
  PrecidenceOperatorClose: "PrecidenceOperatorClose"
};

const grammar = {
  // LITERALS
  [tokens.TRUE]: token => ({
    type: types.BooleanLiteral,
    token: true,
    toString() {
      return token;
    }
  }),
  [tokens.FALSE]: token => ({
    type: types.BooleanLiteral,
    token: false,
    toString() {
      return token;
    }
  }),
  [tokens.EMAIL_REGX]: () => ({
    type: types.PredicateLiteral,
    token: regx(Email),
    toString() {
      return "Email";
    }
  }),
  [tokens.EXTENDED_CHARS_REGX]: () => ({
    type: types.PredicateLiteral,
    token: regx(Xc),
    toString() {
      return "Xc";
    }
  }),
  [tokens.NUM_CHARS_REGX]: () => ({
    type: types.PredicateLiteral,
    token: regx(Nc),
    toString() {
      return "Nc";
    }
  }),
  [tokens.LOW_CHARS_REGX]: () => ({
    type: types.PredicateLiteral,
    token: regx(Lc),
    toString() {
      return "Lc";
    }
  }),
  [tokens.UP_CHARS_REGX]: () => ({
    type: types.PredicateLiteral,
    token: regx(Uc),
    toString() {
      return "Uc";
    }
  }),
  [tokens.LOW_UP_CHARS_REGX]: () => ({
    type: types.PredicateLiteral,
    token: regx(LUc),
    toString() {
      return "LUc";
    }
  }),
  [tokens.EMPTY_OBJ]: () => ({
    type: types.PredicateLiteral,
    token: deep({}),
    toString() {
      return "{}";
    }
  }),
  [tokens.EMPTY_ARRAY]: () => ({
    type: types.PredicateLiteral,
    token: deep([]),
    toString() {
      return "[]";
    }
  }),
  [tokens.EMPTY_STRING_DOUBLE]: () => ({
    type: types.PredicateLiteral,
    token: deep(""),
    toString() {
      return `""`;
    }
  }),
  [tokens.EMPTY_STRING_SINGLE]: () => ({
    type: types.PredicateLiteral,
    token: deep(""),
    toString() {
      return `""`;
    }
  }),
  [tokens.PRIM_NUMBER]: token => ({
    type: types.PredicateLiteral,
    token: prim(Number),
    toString() {
      return "Number";
    }
  }),
  [tokens.PRIM_OBJECT]: token => ({
    type: types.PredicateLiteral,
    token: prim(Object),
    toString() {
      return "Object";
    }
  }),
  [tokens.PRIM_ARRAY]: token => ({
    type: types.PredicateLiteral,
    token: prim(Array),
    toString() {
      return "Array";
    }
  }),
  [tokens.NULL]: () => ({
    type: types.PredicateLiteral,
    token: val(null),
    toString() {
      return "null";
    }
  }),
  [tokens.UNDEFINED]: () => ({
    type: types.PredicateLiteral,
    token: val(undefined),
    toString() {
      return "undefined";
    }
  }),
  [tokens.PRIM_NUMBER_VAL]: token => ({
    type: types.PredicateLiteral,
    token: prim(Number),
    toString() {
      return "number";
    }
  }),
  [tokens.PRIM_BOOLEAN_VAL]: token => ({
    type: types.PredicateLiteral,
    token: prim(Boolean),
    toString() {
      return "boolean";
    }
  }),
  [tokens.PRIM_SYMBOL_VAL]: token => ({
    type: types.PredicateLiteral,
    token: prim(Symbol),
    toString() {
      return "symbol";
    }
  }),
  [tokens.PRIM_STRING_VAL]: token => ({
    type: types.PredicateLiteral,
    token: prim(String),
    toString() {
      return "string";
    }
  }),
  [tokens.PRIM_ARRAY_VAL]: token => ({
    type: types.PredicateLiteral,
    token: prim(Array),
    toString() {
      return "array";
    }
  }),
  [tokens.PRIM_BOOLEAN]: token => ({
    type: types.PredicateLiteral,
    token: prim(Boolean),
    toString() {
      return "Boolean";
    }
  }),
  [tokens.PRIM_STRING]: token => ({
    type: types.PredicateLiteral,
    token: prim(String),
    toString() {
      return "String";
    }
  }),
  [tokens.PRIM_SYMBOL]: token => ({
    type: types.PredicateLiteral,
    token: prim(Symbol),
    toString() {
      return "Symbol";
    }
  }),
  [tokens.PRIM_FUNCTION]: token => ({
    type: types.PredicateLiteral,
    token: prim(Function),
    toString() {
      return "Function";
    }
  }),
  [tokens.TRUTHY]: token => {
    return {
      type: types.PredicateLiteral,
      token: truthy,
      toString() {
        return token;
      }
    };
  },
  [tokens.FALSY_KEYWORD]: token => {
    return {
      type: types.PredicateLiteral,
      token: falsey,
      toString() {
        return "!";
      }
    };
  },
  // TODO: The following should be renamed to be an "Identifier" (rookie mistake)
  [tokens.SYMBOL]: token => ({
    type: types.SymbolLiteral,
    token,
    toString() {
      return token;
    }
  }),
  [tokens.NUMBER]: token => ({
    type: types.NumericLiteral,
    token: Number(token),
    toString() {
      return token;
    }
  }),
  [tokens.STRING_DOUBLE]: token => ({
    type: types.StringLiteral,
    token: token.match(/\"(.*)\"/)[1],
    toString() {
      return token;
    }
  }),
  [tokens.STRING_SINGLE]: token => ({
    type: types.StringLiteral,
    token: token.match(/\'(.*)\'/)[1],
    toString() {
      return token;
    }
  }),
  [tokens.PREDICATE_LOOKUP]: token => {
    return {
      type: types.PredicateLookup,
      token: token.match(/@{LINK:(\d+)}/)[1],
      toString() {
        return token;
      }
    };
  },

  // OPERATORS

  [tokens.NOT]: token => ({
    type: types.Operator,
    token,
    arity: 1,
    runtime: not,
    toString() {
      return token + this.arity;
    },
    prec: 10
  }),
  [tokens.AND]: token => ({
    type: types.Operator,
    token,
    arity: 2,
    runtime: and,
    prec: 20,
    toString() {
      return token;
    }
  }),
  [tokens.AND_SHORT]: token => ({
    type: types.Operator,
    token,
    arity: 2,
    runtime: and,
    prec: 20,
    toString() {
      return token;
    }
  }),

  [tokens.OR]: token => ({
    type: types.Operator,
    token,
    arity: 2,
    runtime: or,
    prec: 30,
    toString() {
      return token;
    }
  }),
  [tokens.OR_SHORT]: token => ({
    type: types.Operator,
    token,
    arity: 2,
    runtime: or,
    prec: 30,
    toString() {
      return token;
    }
  }),
  [tokens.BTW]: token => ({
    type: types.Operator,
    token,
    arity: 2,
    runtime: btw,
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.BTWE]: token => ({
    type: types.Operator,
    token,
    arity: 2,
    runtime: btwe,
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.GTE]: token => ({
    type: types.Operator,
    token,
    arity: 1,
    runtime: gte,
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.LTE]: token => ({
    type: types.Operator,
    token,
    arity: 1,
    runtime: lte,
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.GT]: token => ({
    type: types.Operator,
    token,
    arity: 1,
    runtime: gt,
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.LT]: token => ({
    type: types.Operator,
    token,
    arity: 1,
    runtime: lt,
    prec: 50,
    toString() {
      return token;
    }
  }),

  // functions have highest precidence
  [tokens.ENTRY]: token => {
    return {
      type: types.Operator,
      token,
      arity: 2,
      runtime: entry,
      prec: 100,
      toString() {
        return token;
      }
    };
  },

  [tokens.OBJ]: token => ({
    type: types.VariableArityOperator,
    token,
    arity: 0,
    runtime: obj,
    prec: 100,
    toString() {
      return token + this.arity;
    }
  }),

  [tokens.OBJ_CLOSE]: token => ({
    type: types.VariableArityOperatorClose,
    token,
    matchingToken: "{",
    toString() {
      return token;
    }
  }),

  [tokens.HOLDS]: token => ({
    type: types.VariableArityOperator,
    token,
    arity: 0,
    runtime: holds,
    prec: 100,
    toString() {
      return token + this.arity;
    }
  }),

  [tokens.HOLDS_CLOSE]: token => ({
    type: types.VariableArityOperatorClose,
    token,
    matchingToken: "[",
    toString() {
      return token;
    }
  }),

  [tokens.ARG]: token => ({
    type: types.ArgumentSeparator,
    token,
    toString() {
      return token;
    }
  }),

  [tokens.PRECEDENCE]: token => ({
    type: types.PrecidenceOperator,
    token,
    toString() {
      return token;
    }
  }),
  [tokens.PRECEDENCE_CLOSE]: token => ({
    type: types.PrecidenceOperatorClose,
    token,
    toString() {
      return token;
    }
  })
};

function isOperator(node) {
  if (!node) return false;
  return node.type === types.Operator;
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
  return node.type === types.PredicateLookup;
}
function isVaradicFunctionClose(node) {
  if (!node) return false;
  return node.type === types.VariableArityOperatorClose;
}

function isVaradicFunction(node) {
  if (!node) return false;
  return node.type === types.VariableArityOperator;
}

function isBooleanable(node) {
  return (
    isLiteral(node) ||
    isPredicateLookup(node) ||
    isVaradicFunction(node) ||
    isPrecidenceOperator(node)
  );
}

function isArgumentSeparator(node) {
  if (!node) return false;
  return node.type === types.ArgumentSeparator;
}
function isPrecidenceOperator(node) {
  if (!node) return false;
  return node.type === types.PrecidenceOperator;
}

function isPrecidenceOperatorClose(node) {
  if (!node) return false;
  return node.type === types.PrecidenceOperatorClose;
}

module.exports = {
  grammar,
  tokens,
  types,
  isPrecidenceOperatorClose,
  isPrecidenceOperator,
  isArgumentSeparator,
  isVaradicFunction,
  isVaradicFunctionClose,
  isPredicateLookup,
  isBooleanable,
  isLiteral,
  isOperator
};
