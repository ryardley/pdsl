const { getRawHelpers } = require("./helpers");
const {
  and,
  btw,
  btwe,
  deep,
  Email,
  entry,
  extant,
  gt,
  gte,
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
  Xc,
  arrArgMatch,
  arrTypeMatch,
  strLen,
  arrLen,
  wildcard
} = getRawHelpers();

// In order of global greedy token parsing
const tokens = {
  TRUE: "true",
  FALSE: "false",
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
  STRING_LENGTH: "string\\[",
  ARRAY_LENGTH: "array\\[",
  PRIM_NUMBER: "Number",
  PRIM_OBJECT: "Object",
  ARRAY_TYPED: "Array<",
  PRIM_ARRAY: "Array",
  NULL: "null",
  UNDEFINED: "undefined",
  PRIM_NUMBER_VAL: "number",
  PRIM_BOOLEAN_VAL: "boolean",
  PRIM_SYMBOL_VAL: "symbol",
  PRIM_STRING_VAL: "string",
  PRIM_ARRAY_VAL: "array",
  PRIM_BOOLEAN: "Boolean",
  PRIM_STRING: "String",
  PRIM_SYMBOL: "Symbol",
  PRIM_FUNCTION: "Function",
  WILDCARD_PREDICATE: "\\*",
  TRUTHY: "\\!\\!",
  FALSY_KEYWORD: "falsey", // Using literal falsey as if we use "\\!" it will be picked up all the not operators
  SYMBOL: "[a-zA-Z_]+[a-zA-Z0-9_-]*",
  EXTANT_PREDICATE: "_",
  REST_SYMBOL: "\\.\\.\\.",
  NUMBER: "-?\\d+(\\.\\d+)?",
  STRING_DOUBLE: `\\"[^\\"]*\\"`,
  STRING_SINGLE: `\\'[^\\']*\\'`,
  PREDICATE_LOOKUP: "@{LINK:(\\d+)}",
  NOT: "\\!",
  AND: "\\&\\&",
  AND_SHORT: "\\&",
  OR: "\\|\\|",
  OR_SHORT: "\\|",
  BTW: "\\<\\s\\<",
  BTWE: "\\.\\.",
  GTE: "\\>\\=",
  LTE: "\\<\\=",
  GT: "\\>(?=(?:\\s*)?[\\.\\d])", // disambiguation checks if followed by a number
  LT: "\\<",
  ENTRY: "\\:",
  OBJ: "\\{",
  OBJ_CLOSE: "\\}",
  ARRAY: "\\[",
  ARRAY_CLOSE: "\\]",
  ARG: "\\,",
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
    token,
    runtime: () => true,
    toString() {
      return token;
    }
  }),
  [tokens.FALSE]: token => ({
    type: types.BooleanLiteral,
    token,
    runtime: () => false,
    toString() {
      return token;
    }
  }),
  [tokens.EMAIL_REGX]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => regx(ctx)(Email),
    toString() {
      return "Email";
    }
  }),
  [tokens.EXTENDED_CHARS_REGX]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => regx(ctx)(Xc),
    toString() {
      return "Xc";
    }
  }),
  [tokens.NUM_CHARS_REGX]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => regx(ctx)(Nc),
    toString() {
      return "Nc";
    }
  }),
  [tokens.LOW_CHARS_REGX]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => regx(ctx)(Lc),
    toString() {
      return "Lc";
    }
  }),
  [tokens.UP_CHARS_REGX]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => regx(ctx)(Uc),
    toString() {
      return "Uc";
    }
  }),
  [tokens.LOW_UP_CHARS_REGX]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => regx(ctx)(LUc),
    toString() {
      return "LUc";
    }
  }),
  [tokens.EMPTY_OBJ]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => deep(ctx)({}),
    toString() {
      return "{}";
    }
  }),
  [tokens.EMPTY_ARRAY]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => deep(ctx)([]),
    toString() {
      return "[]";
    }
  }),
  [tokens.EMPTY_STRING_DOUBLE]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => deep(ctx)(""),
    toString() {
      return `""`;
    }
  }),
  [tokens.EMPTY_STRING_SINGLE]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => deep(ctx)(""),
    toString() {
      return `""`;
    }
  }),
  [tokens.PRIM_NUMBER]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(Number),
    toString() {
      return "Number";
    }
  }),
  [tokens.PRIM_OBJECT]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(Object),
    toString() {
      return "Object";
    }
  }),
  [tokens.PRIM_ARRAY]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(Array),
    toString() {
      return "Array";
    }
  }),
  [tokens.NULL]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => val(ctx)(null),
    toString() {
      return "null";
    }
  }),
  [tokens.UNDEFINED]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => val(ctx)(undefined),
    toString() {
      return "undefined";
    }
  }),
  [tokens.PRIM_NUMBER_VAL]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(Number),
    toString() {
      return "number";
    }
  }),
  [tokens.PRIM_BOOLEAN_VAL]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(Boolean),
    toString() {
      return "boolean";
    }
  }),
  [tokens.PRIM_SYMBOL_VAL]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(Symbol),
    toString() {
      return "symbol";
    }
  }),
  [tokens.PRIM_STRING_VAL]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(String),
    toString() {
      return "string";
    }
  }),
  [tokens.PRIM_ARRAY_VAL]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: /* istanbul ignore next */ ctx => prim(ctx)(Array),
    toString() {
      return "array";
    }
  }),
  [tokens.PRIM_BOOLEAN]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(Boolean),
    toString() {
      return "Boolean";
    }
  }),
  [tokens.PRIM_STRING]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(String),
    toString() {
      return "String";
    }
  }),
  [tokens.PRIM_SYMBOL]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(Symbol),
    toString() {
      return "Symbol";
    }
  }),
  [tokens.PRIM_FUNCTION]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(Function),
    toString() {
      return "Function";
    }
  }),
  [tokens.EXTANT_PREDICATE]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => extant(ctx),
    toString() {
      return "_";
    }
  }),
  [tokens.WILDCARD_PREDICATE]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => wildcard(ctx),
    toString() {
      return "*";
    }
  }),
  [tokens.TRUTHY]: token => {
    return {
      type: types.PredicateLiteral,
      token,
      runtime: ctx => truthy(ctx),
      toString() {
        return "!!";
      }
    };
  },
  [tokens.FALSY_KEYWORD]: token => {
    return {
      type: types.PredicateLiteral,
      token,
      runtime: ctx => falsey(ctx),
      toString() {
        return "!";
      }
    };
  },
  // TODO: The following should be renamed to be an "Identifier" (rookie mistake)
  [tokens.SYMBOL]: token => ({
    type: types.SymbolLiteral,
    token,
    runtime: () => token, // token will be a string as in "name" so ctx makes no sense
    toString() {
      return token;
    }
  }),
  [tokens.REST_SYMBOL]: token => ({
    type: types.SymbolLiteral,
    token,
    runtime: () => token,
    toString() {
      return token;
    }
  }),
  [tokens.NUMBER]: token => ({
    type: types.NumericLiteral,
    token,
    runtime: () => Number(token),
    toString() {
      return token;
    }
  }),
  [tokens.STRING_DOUBLE]: token => {
    const t = token.match(/\"(.*)\"/);
    /* istanbul ignore next because __deafult never matches in tests */
    const val = t ? t[1] : "__default";
    return {
      type: types.StringLiteral,
      token: val,
      runtime: () => val,
      toString() {
        return token;
      }
    };
  },
  [tokens.STRING_SINGLE]: token => {
    const t = token.match(/\'(.*)\'/);
    /* istanbul ignore next because __deafult never matches in tests */
    const val = t ? t[1] : "__default";
    return {
      type: types.StringLiteral,
      token: val,
      runtime: () => val,
      toString() {
        return token;
      }
    };
  },
  [tokens.PREDICATE_LOOKUP]: token => {
    const t = token.match(/@{LINK:(\d+)}/);
    /* istanbul ignore next because __deafult never matches in tests */
    const val = t ? t[1] : "__default";
    return {
      type: types.PredicateLookup,
      token: val,
      runtime: /* istanbul ignore next as not used */ () => val,
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
    runtime: ctx => not(ctx),
    toString() {
      return token + this.arity;
    },
    prec: 10
  }),
  [tokens.AND]: token => ({
    type: types.Operator,
    token,
    arity: 2,
    runtime: ctx => and(ctx),
    prec: 60,
    toString() {
      return token;
    }
  }),
  [tokens.AND_SHORT]: token => ({
    type: types.Operator,
    token,
    arity: 2,
    runtime: ctx => and(ctx),
    prec: 60,
    toString() {
      return token;
    }
  }),

  [tokens.OR]: token => ({
    type: types.Operator,
    token,
    arity: 2,
    runtime: ctx => or(ctx),
    prec: 60,
    toString() {
      return token;
    }
  }),
  [tokens.OR_SHORT]: token => ({
    type: types.Operator,
    token,
    arity: 2,
    runtime: ctx => or(ctx),
    prec: 60,
    toString() {
      return token;
    }
  }),
  [tokens.BTW]: token => ({
    type: types.Operator,
    token,
    arity: 2,
    runtime: ctx => btw(ctx),
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.BTWE]: token => ({
    type: types.Operator,
    token,
    arity: 2,
    runtime: ctx => btwe(ctx),
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.GTE]: token => ({
    type: types.Operator,
    token,
    arity: 1,
    runtime: ctx => gte(ctx),
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.LTE]: token => ({
    type: types.Operator,
    token,
    arity: 1,
    runtime: ctx => lte(ctx),
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.GT]: token => ({
    type: types.Operator,
    token,
    arity: 1,
    runtime: ctx => gt(ctx),
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.LT]: token => ({
    type: types.Operator,
    token,
    arity: 1,
    runtime: ctx => lt(ctx),
    prec: 50,
    toString() {
      return token;
    }
  }),

  // functions have highest precidence
  [tokens.ENTRY]: token => ({
    type: types.Operator,
    token,
    arity: 2,
    runtime: ctx => entry(ctx),
    prec: 100,
    toString() {
      return token;
    }
  }),

  [tokens.OBJ]: token => ({
    type: types.VariableArityOperator,
    token,
    arity: 0,
    runtime: ctx => obj(ctx),
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

  [tokens.ARRAY]: token => ({
    type: types.VariableArityOperator,
    token,
    arity: 0,
    runtime: ctx => arrArgMatch(ctx),
    prec: 100,
    toString() {
      return token + this.arity;
    }
  }),

  [tokens.ARRAY_CLOSE]: token => ({
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
  }),
  [tokens.ARRAY_TYPED]: token => ({
    type: types.Operator,
    token,
    arity: 1,
    prec: 50,
    runtime: ctx => arrTypeMatch(ctx),
    toString() {
      return "Array<";
    }
  }),
  [tokens.STRING_LENGTH]: token => ({
    type: types.Operator,
    token,
    arity: 1,
    prec: 50,
    runtime: strLen,
    toString() {
      return "string[";
    }
  }),
  [tokens.ARRAY_LENGTH]: token => ({
    type: types.Operator,
    token,
    arity: 1,
    prec: 50,
    runtime: ctx => arrLen(ctx),
    toString() {
      return "array[";
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

function hasToken(node, token) {
  return node && node.token === token;
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
  hasToken,
  isLiteral,
  isOperator
};
