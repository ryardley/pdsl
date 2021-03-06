import { getRawHelpers } from "../helpers/index";
const {
  and,
  arrArgMatch,
  arrLen,
  arrTypeMatch,
  arrIncl,
  btw,
  btwe,
  deep,
  Email,
  entry,
  extant,
  falsey,
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
  strLen,
  truthy,
  Uc,
  val,
  validation,
  wildcard,
  Xc
} = getRawHelpers();

// In order of global greedy token parsing
export const tokens = {
  TRUE: "true",
  FALSE: "false",
  EMAIL_REGX: "Email",
  EXTENDED_CHARS_REGX: "Xc",
  NUM_CHARS_REGX: "Nc",
  LOW_CHARS_REGX: "Lc",
  UP_CHARS_REGX: "Uc",
  LOW_UP_CHARS_REGX: "LUc",
  VALIDATION_MSG: `<-\\s*\\"((?:\\\\\\"|[^\\"])*)\\"`,
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
  IDENTIFIER: "[a-zA-Z_]+[a-zA-Z0-9_-]*",
  EXTANT_PREDICATE: "_",
  REST_SYMBOL: "\\.\\.\\.",
  NUMBER: "-?\\d+(\\.\\d+)?",
  STRING_DOUBLE: `\\"[^\\"]*\\"`,
  STRING_SINGLE: `\\'[^\\']*\\'`,
  PREDICATE_LOOKUP: "@{LINK:(\\d+)}",
  OBJ_EXACT: "\\{\\|",
  OBJ_EXACT_CLOSE: "\\|\\}",
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
  ARRAY_INCLUDES: "\\[\\?",
  ARRAY: "\\[",
  ARRAY_CLOSE: "\\]",
  ARG: "\\,",
  PRECEDENCE: "\\(",
  PRECEDENCE_CLOSE: "\\)"
};

export const types = {
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

export const grammar = {
  // LITERALS
  [tokens.TRUE]: token => ({
    type: types.BooleanLiteral,
    token,
    runtime: () => true,
    runtimeIdentifier: undefined,
    toString() {
      return token;
    }
  }),
  [tokens.FALSE]: token => ({
    type: types.BooleanLiteral,
    token,
    runtime: () => false,
    runtimeIdentifier: undefined,
    toString() {
      return token;
    }
  }),
  [tokens.EMAIL_REGX]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => regx(ctx)(Email),
    runtimeIdentifier: "regx",
    toString() {
      return "Email";
    }
  }),
  [tokens.EXTENDED_CHARS_REGX]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => regx(ctx)(Xc),
    runtimeIdentifier: "regx",
    toString() {
      return "Xc";
    }
  }),
  [tokens.NUM_CHARS_REGX]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => regx(ctx)(Nc),
    runtimeIdentifier: "regx",
    toString() {
      return "Nc";
    }
  }),
  [tokens.LOW_CHARS_REGX]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => regx(ctx)(Lc),
    runtimeIdentifier: "regx",
    toString() {
      return "Lc";
    }
  }),
  [tokens.UP_CHARS_REGX]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => regx(ctx)(Uc),
    runtimeIdentifier: "regx",
    toString() {
      return "Uc";
    }
  }),
  [tokens.LOW_UP_CHARS_REGX]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => regx(ctx)(LUc),
    runtimeIdentifier: "regx",
    toString() {
      return "LUc";
    }
  }),
  [tokens.EMPTY_OBJ]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => deep(ctx)({}),
    runtimeIdentifier: "deep",
    toString() {
      return "{}";
    }
  }),
  [tokens.EMPTY_ARRAY]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => deep(ctx)([]),
    runtimeIdentifier: "deep",
    toString() {
      return "[]";
    }
  }),
  [tokens.EMPTY_STRING_DOUBLE]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => deep(ctx)(""),
    runtimeIdentifier: "deep",
    toString() {
      return `""`;
    }
  }),
  [tokens.EMPTY_STRING_SINGLE]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => deep(ctx)(""),
    runtimeIdentifier: "deep",
    toString() {
      return `""`;
    }
  }),
  [tokens.PRIM_NUMBER]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(Number),
    runtimeIdentifier: "prim",
    toString() {
      return "Number";
    }
  }),
  [tokens.PRIM_OBJECT]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(Object),
    runtimeIdentifier: "prim",
    toString() {
      return "Object";
    }
  }),
  [tokens.PRIM_ARRAY]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(Array),
    runtimeIdentifier: "prim",
    toString() {
      return "Array";
    }
  }),
  [tokens.NULL]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => val(ctx)(null),
    runtimeIdentifier: "val",
    toString() {
      return "null";
    }
  }),
  [tokens.UNDEFINED]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => val(ctx)(undefined),
    runtimeIdentifier: "val",
    toString() {
      return "undefined";
    }
  }),
  [tokens.PRIM_NUMBER_VAL]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(Number),
    runtimeIdentifier: "prim",
    toString() {
      return "number";
    }
  }),
  [tokens.PRIM_BOOLEAN_VAL]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(Boolean),
    runtimeIdentifier: "prim",
    toString() {
      return "boolean";
    }
  }),
  [tokens.PRIM_SYMBOL_VAL]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(Symbol),
    runtimeIdentifier: "prim",
    toString() {
      return "symbol";
    }
  }),
  [tokens.PRIM_STRING_VAL]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(String),
    runtimeIdentifier: "prim",
    toString() {
      return "string";
    }
  }),
  [tokens.PRIM_ARRAY_VAL]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: /* istanbul ignore next */ ctx => prim(ctx)(Array),
    runtimeIdentifier: "prim",
    toString() {
      return "array";
    }
  }),
  [tokens.PRIM_BOOLEAN]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(Boolean),
    runtimeIdentifier: "prim",
    toString() {
      return "Boolean";
    }
  }),
  [tokens.PRIM_STRING]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(String),
    runtimeIdentifier: "prim",
    toString() {
      return "String";
    }
  }),
  [tokens.PRIM_SYMBOL]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(Symbol),
    runtimeIdentifier: "prim",
    toString() {
      return "Symbol";
    }
  }),
  [tokens.PRIM_FUNCTION]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => prim(ctx)(Function),
    runtimeIdentifier: "prim",
    toString() {
      return "Function";
    }
  }),
  [tokens.EXTANT_PREDICATE]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => extant(ctx),
    runtimeIdentifier: "extant",
    toString() {
      return "_";
    }
  }),
  [tokens.WILDCARD_PREDICATE]: token => ({
    type: types.PredicateLiteral,
    token,
    runtime: ctx => wildcard(),
    runtimeIdentifier: "wildcard",
    toString() {
      return "*";
    }
  }),
  [tokens.TRUTHY]: token => {
    return {
      type: types.PredicateLiteral,
      token,
      runtime: ctx => truthy(ctx),
      runtimeIdentifier: "truthy",
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
      runtimeIdentifier: "falsey",
      toString() {
        return "!";
      }
    };
  },
  [tokens.IDENTIFIER]: token => ({
    type: types.SymbolLiteral,
    token,
    runtime: () => token,
    runtimeIdentifier: undefined,
    toString() {
      return token;
    }
  }),
  [tokens.REST_SYMBOL]: token => ({
    type: types.SymbolLiteral,
    token,
    runtime: () => token,
    runtimeIdentifier: undefined,
    toString() {
      return token;
    }
  }),
  [tokens.NUMBER]: token => ({
    type: types.NumericLiteral,
    token,
    runtime: () => Number(token),
    runtimeIdentifier: undefined,
    toString() {
      return token;
    }
  }),
  [tokens.STRING_DOUBLE]: token => {
    const t = token.match(/\"(.*)\"/);
    /* istanbul ignore next because __deafult never matches in tests */
    const value = t ? t[1] : "__default";
    return {
      type: types.StringLiteral,
      token: value,
      runtime: ctx => val(ctx)(value),
      runtimeIdentifier: "val",
      toString() {
        return token;
      }
    };
  },
  [tokens.STRING_SINGLE]: token => {
    const t = token.match(/\'(.*)\'/);
    /* istanbul ignore next because __deafult never matches in tests */
    const value = t ? t[1] : "__default";
    return {
      type: types.StringLiteral,
      token: value,
      runtime: ctx => val(ctx)(value),
      runtimeIdentifier: "val",
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
      runtimeIdentifier: undefined,
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
    runtimeIdentifier: "not",
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
    runtimeIdentifier: "and",
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
    runtimeIdentifier: "and",
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
    runtimeIdentifier: "or",
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
    runtimeIdentifier: "or",
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
    runtimeIdentifier: "btw",
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
    runtimeIdentifier: "btwe",
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
    runtimeIdentifier: "gte",
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
    runtimeIdentifier: "lte",
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
    runtimeIdentifier: "gt",
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
    runtimeIdentifier: "lt",
    prec: 50,
    toString() {
      return token;
    }
  }),
  [tokens.VALIDATION_MSG]: token => {
    const [, msg] = token.match(
      /<-\s*\"((?:\\\"|[^\"])*)\"/
    ) || /* istanbul ignore next because it is tested in babel plugin */ [, ""];

    return {
      type: types.Operator,
      token: ":e:",
      arity: 1,
      prec: 55, //??
      runtime: ctx => validation(ctx)(msg.trim()),
      runtimeIdentifier: "validation",
      toString() {
        return ":e:" + msg.slice(0, 3) + ":";
      }
    };
  },

  // functions have highest precidence
  [tokens.ENTRY]: token => ({
    type: types.Operator,
    token,
    arity: 2,
    runtime: ctx => entry(ctx),
    runtimeIdentifier: "entry",
    prec: 100,
    toString() {
      return token;
    }
  }),

  [tokens.OBJ_EXACT]: token => ({
    type: types.VariableArityOperator,
    token,
    arity: 0,
    runtime: ctx => obj(ctx, true),
    runtimeIdentifier: "obj",
    prec: 100,
    closingToken: "|}",
    toString() {
      return token + this.arity;
    }
  }),

  [tokens.OBJ_EXACT_CLOSE]: token => ({
    type: types.VariableArityOperatorClose,
    token,
    toString() {
      return token;
    }
  }),

  [tokens.OBJ]: token => ({
    type: types.VariableArityOperator,
    token,
    arity: 0,
    runtime: ctx => obj(ctx),
    runtimeIdentifier: "obj",
    prec: 100,
    closingToken: "}",
    toString() {
      return token + this.arity;
    }
  }),

  [tokens.OBJ_CLOSE]: token => ({
    type: types.VariableArityOperatorClose,
    token,
    toString() {
      return token;
    }
  }),

  [tokens.ARRAY_INCLUDES]: token => ({
    type: types.VariableArityOperator,
    token,
    arity: 0,
    runtime: ctx => arrIncl(ctx),
    runtimeIdentifier: "arrIncl",
    prec: 100,
    closingToken: "]",
    toString() {
      return token + this.arity;
    }
  }),

  [tokens.ARRAY]: token => ({
    type: types.VariableArityOperator,
    token,
    arity: 0,
    runtime: ctx => arrArgMatch(ctx),
    runtimeIdentifier: "arrArgMatch",
    prec: 100,
    closingToken: "]",
    toString() {
      return token + this.arity;
    }
  }),

  [tokens.ARRAY_CLOSE]: token => ({
    type: types.VariableArityOperatorClose,
    token,
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
    runtimeIdentifier: "arrTypeMatch",
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
    runtimeIdentifier: "strLen",
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
    runtimeIdentifier: "arrLen",
    toString() {
      return "array[";
    }
  })
};

export function isOperator(node) {
  if (!node) return false;
  return node.type === types.Operator;
}

export function isLiteral(node) {
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

export function isPredicateLookup(node) {
  if (!node) return false;
  return node.type === types.PredicateLookup;
}
export function isVaradicFunctionClose(node) {
  if (!node) return false;
  return node.type === types.VariableArityOperatorClose;
}

export function isVaradicFunction(node, closingNode?) {
  if (!node) return false;

  const isVaradicStart = node.type === types.VariableArityOperator;

  if (!closingNode) return isVaradicStart;

  return isVaradicStart && node.closingToken === closingNode.token;
}

export function isBooleanable(node) {
  return (
    isLiteral(node) ||
    isPredicateLookup(node) ||
    isVaradicFunction(node) ||
    isPrecidenceOperator(node)
  );
}

export function isArgumentSeparator(node) {
  if (!node) return false;
  return node.type === types.ArgumentSeparator;
}
export function isPrecidenceOperator(node) {
  if (!node) return false;
  return node.type === types.PrecidenceOperator;
}

export function isPrecidenceOperatorClose(node) {
  if (!node) return false;
  return node.type === types.PrecidenceOperatorClose;
}

export function hasToken(node, token) {
  return node && node.token === token;
}
