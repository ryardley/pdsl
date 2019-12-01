const {
  identity,
  isDeepVal,
  isFunction,
  isPrimative,
  isRegEx
} = require("./utils");

// NOTE:  All return functions must have names becuase
//        they are used for the babel plugin

/**
 * <h3>Between bounds</h3>
 * Return a function that checks to see if it's input is between two numbers not including the numbers.
 *
 * @param {number} a The lower number
 * @param {number} b The higher number
 * @return {function} A function of the form number => boolean
 */
const createBtw = () =>
  function btw(a, b) {
    return function btwFn(n) {
      const [min, max] = a < b ? [a, b] : [b, a];
      return n > min && n < max;
    };
  };

/**
 * <h3>Between bounds or equal to</h3>
 * Return a function that checks to see if it's input is between two numbers including the numbers.
 *
 * @param {number} a The lower number
 * @param {number} b The higher number
 * @return {function} A function of the form number => boolean
 */
const createBtwe = () =>
  function btwe(a, b) {
    return function btweFn(n) {
      const [min, max] = a < b ? [a, b] : [b, a];
      return n >= min && n <= max;
    };
  };

/**
 * <h3>Less than</h3>
 * Return a function that checks to see if it's input is less than the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
const createLt = () =>
  function lt(a) {
    return function ltFn(n) {
      return n < a;
    };
  };

/**
 * <h3>Less than or equal to</h3>
 * Return a function that checks to see if it's input is less than or equal to the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
const createLte = () =>
  function lte(a) {
    return function lteFn(n) {
      return n <= a;
    };
  };

/**
 * <h3>Greater than</h3>
 * Return a function that checks to see if it's input is greater than the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
const createGt = () =>
  function gt(a) {
    return function gtFn(n) {
      return n > a;
    };
  };
/**
 * <h3>Greater than or equal to</h3>
 * Return a function that checks to see if it's input is greater than or equal to the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
const createGte = () =>
  function gte(a) {
    return function gteFn(n) {
      return n >= a;
    };
  };

/**
 * <h3>Array match</h3>
 * Return a function that checks to see if an array contains either any of the values listed or if any of the predicate functions provided return true when run over all items in the array.
 * Eg,
 * <pre><code>
 * // Helper functions
 * const isNumeric = a => typeof a === 'number';
 * const isString = a => typeof a === 'string';
 *
 * arrArgMatch(isNumeric, isNumeric, isNumeric)([1,2,3]); // true
 * arrArgMatch(isNumeric, isNumeric, isNumeric, '...')([1,2,3]); // true
 * arrArgMatch(isString, isNumeric, isNumeric, '...')([1,2,3]); // false
 * arrArgMatch(isString, isNumeric, isNumeric, '...')(['1',2,3]); // true
 * arrArgMatch(isNumeric, isNumeric, isNumeric, '...')([1,2,3,4]); // true
 * arrArgMatch(1, 2)([1,3]); // false
 * </code></pre>
 *
 * @param {...function|*} tests Either values, `['...', predicate]` or predicate functions used to test the contents of the array.
 * @return {function} A function of the form <code>{array => boolean}</code>
 */
const createArrArgMatch = ctx =>
  function arrArgMatch(...tests) {
    function matchFn(arr) {
      const hasWildcard = tests.slice(-1)[0] === "...";
      let matches = hasWildcard || arr.length === tests.length;
      for (let i = 0; i < tests.length; i++) {
        const testVal = tests[i];
        const predicate =
          testVal === "..." ? createWildcard(ctx) : createVal(ctx)(testVal);
        const pass = predicate(arr[i]);
        matches = matches && pass;
      }
      return matches;
    }
    return matchFn;
  };

/**
 * <h3>Array type match</h3>
 * Return a function that checks to see if an array contains only the values listed or if the predicate function provided returns true when run over all items in the array.
 * Eg,
 * <pre><code>
 * // Helper functions
 * const isNumeric = a => typeof a === 'number';
 * const isString = a => typeof a === 'string';
 *
 * arrTypeMatch(isNumeric)([1,2,3]); // true
 * arrTypeMatch(isNumeric)([1,2,'3']); // false
 * arrTypeMatch(isNumeric)([]); // true
 * </code></pre>
 *
 * @param {function|*} test predicate function used to test the contents of the array.
 * @return {function} A function of the form <code>{array => boolean}</code>
 */
const createArrTypeMatch = ctx =>
  function arrTypeMatch(test) {
    const predicate = createVal(ctx)(test);
    function matchFn(arr) {
      if (!Array.isArray(arr)) return false;

      let matches = true;
      for (let i = 0; i < arr.length; i++) {
        matches = matches && predicate(arr[i]);
      }
      return matches;
    }
    return matchFn;
  };

/**
 * <h3>Array holds</h3>
 * Return a function that checks to see if an array contains either any of the values listed or if any of the predicate functions provided return true when run over all items in the array.
 * Eg,
 * <pre><code>
 * holds(a => a > 3, 2)([1,2,3]); // true
 * holds(1, 2)([1,3]); // false
 * </code></pre>
 *
 * @param {...function|*} args Either values or predicate functions used to test the contents of the array.
 * @return {function} A function of the form <code>{array => boolean}</code>
 */
const createHolds = ctx =>
  function holds(...args) {
    return function holdsFn(n) {
      let i, j;
      let fns = [];
      let success = [];

      // prepare args as an array of predicate fns and an array to keep track of success
      for (i = 0; i < args.length; i++) {
        const arg = args[i];
        fns.push(createVal(ctx)(arg));
        success.push(false);
      }

      // loop through array only once
      for (i = 0; i < n.length; i++) {
        const item = n[i];
        for (j = 0; j < fns.length; j++) {
          if (!success[j]) {
            const fn = fns[j];
            success[j] = success[j] || fn(item);
          }
        }
      }

      return success.reduce((a, b) => a && b);
    };
  };

/**
 * <h3>Logical OR</h3>
 * Combine predicates to form a new predicate that ORs the result of the input predicates.
 *
 * @param {function} left The first predicate
 * @param {function} right The second predicate
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const createOr = ctx =>
  function or(left, right) {
    return function orFn(a) {
      const val = createVal(ctx);
      ctx.batchStart();
      const result = val(left)(a) || val(right)(a);
      if (!result) {
        ctx.batchCommit();
      }
      ctx.batchPurge();
      return result;
    };
  };

/**
 * <h3>Logical AND</h3>
 * Combine predicates to form a new predicate that ANDs the result of the input predicates.
 *
 * @param {function} left The first predicate
 * @param {function} right The second predicate
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const createAnd = ctx =>
  function and(left, right) {
    return function andFn(a) {
      const val = createVal(ctx);
      return val(left)(a) && val(right)(a);
    };
  };

/**
 * <h3>Logical NOT</h3>
 * Takes an input predicate to form a new predicate that NOTs the result of the input predicate.
 *
 * @param {function} input The input predicate
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const createNot = ctx =>
  function not(input) {
    return function notFn(a) {
      return !createVal(ctx)(input)(a);
    };
  };

const createExtant = () =>
  function extant(a) {
    return a !== null && a !== undefined;
  };

/**
 * <h3>Truthy</h3>
 * A predicate that takes an input value and returns whether or not the value is truthy
 *
 * @param {function} input The input value
 * @return {boolean} Boolean value indicating if the input is truthy
 */
const createTruthy = () =>
  function truthy(a) {
    return !!a;
  };

/**
 * <h3>Falsey</h3>
 * A predicate that takes an input value and returns whether or not the value is falsey
 *
 * @param {function} input The input value
 * @return {boolean} Boolean value indicating if the input is falsey
 */
const createFalsey = () =>
  function falsey(a) {
    return !a;
  };

const createObj = ctx =>
  function obj(...entriesWithRest) {
    return function objFn(a) {
      const isExtant = createExtant(ctx);
      let hasRest = false;
      let entriesMatch = true;
      let entryCount = 0;

      // For loop is faster
      for (let i = 0; i < entriesWithRest.length; i++) {
        const entry = entriesWithRest[i];

        // Ignore rest and note we have one
        if (entry === "...") {
          hasRest = hasRest || true;
          continue;
        }

        // Extract key and predicate from the entry and run the predicate against the value
        const [key, predicate] = Array.isArray(entry)
          ? entry
          : [entry, isExtant];

        // Storing the object path on a global stack
        ctx.pushObjStack(key);

        let result;
        if (ctx.abortEarly) {
          result = isExtant(a) && predicate(a[key]);
        } else {
          // Ensure that the test is run no matter what the previous tests were
          // This is important for collecting errors
          const propExists = isExtant(a);
          result = predicate(propExists ? a[key] : undefined);
        }

        // Popping the object path off the global stack
        if (ctx.popObjStack() !== key) throw new Error("Object stack error");
        entriesMatch = entriesMatch && result;
        // We just logged an entry track it
        entryCount++;
      }

      // If there was a rest arg we don't need to check length
      if (hasRest) return entriesMatch;

      // Check entry length
      return entriesMatch && Object.keys(a).length === entryCount;
    };
  };

/**
 * <h3>Is strict equal to value</h3>
 * Takes an input value to form a predicate that checks if the input strictly equals by reference the value.
 *
 * @param {function|*} value The input value if already a fuction it will be returned
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const createVal = () => value =>
  typeof value === "function"
    ? value
    : function isVal(a) {
        return a === value;
      };

/**
 * <h3>Is deep equal to value</h3>
 * Takes an input value to form a predicate that checks if the input deeply equals the value.
 *
 * @param {function} value The input value
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const createDeep = () =>
  function deep(value) {
    const st = JSON.stringify(value);
    return a => st === JSON.stringify(a);
  };

/**
 * <h3>Regular Expression predicate</h3>
 * Forms a predicate from a given regular expression
 *
 * @param {RegExp} rx The input value
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const createRegx = ctx =>
  function regx(rx) {
    const rgx = typeof rx === "function" ? rx(ctx) : rx;
    return rgx.test.bind(rgx);
  };

/**
 * <h3>Primative predicate</h3>
 * Forms a predicate from a given JavaSCript primative object to act as a typeof check for the input value.
 *
 * Eg. <pre><code>
 * prim(Function)(() => {}); // true
 * prim(Number)(6); // true
 * </code></pre>
 *
 * @param {object} primative The input primative one of Array, Boolean, Number, Symbol, BigInt, String, Function, Object
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const createPrim = () =>
  function prim(primative) {
    if (primative.name === "Array") return a => Array.isArray(a);

    return a => typeof a === primative.name.toLowerCase();
  };

function createExpressionParser(ctx, expression) {
  if (isFunction(expression)) {
    if (isPrimative(expression)) return createPrim(ctx);
    return identity;
  }
  if (isRegEx(expression)) return createRegx(ctx);
  if (isDeepVal(expression)) return createDeep(ctx);
  return createVal(ctx);
}

/**
 * <h3>Predicate</h3>
 * Creates an appropriate predicate based on an input value. This will choose a predicate transformer dynamically based on the type of input.
 *
 * @param {*} input Anything parsable
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const createPred = ctx =>
  function pred(input) {
    const expParser = createExpressionParser(ctx, input);
    return expParser(input);
  };

const createStrLen = ctx =>
  function strLen(input) {
    return function strLenFn(a) {
      return typeof a === "string" && createVal(ctx)(input)(a.length);
    };
  };

const createArrLen = ctx =>
  function arrLen(input) {
    return function arrLenFn(a) {
      return Array.isArray(a) && createVal(ctx)(input)(a.length);
    };
  };

const createWildcard = () =>
  function wilcard() {
    return true;
  };

const createEntry = ctx =>
  function entry(name, predicate) {
    return [name, createVal(ctx)(predicate)];
  };

const Email = () => /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]+)$/;
const Xc = () => /(?=.*[^a-zA-Z0-9\s]).*/;
const Nc = () => /(?=.*[0-9]).*/;
const Lc = () => /(?=.*[a-z]).*/;
const Uc = () => /(?=.*[A-Z]).*/;
const LUc = () => /(?=.*[a-z])(?=.*[A-Z]).*/;

function passContextToHelpers(ctx, helpers) {
  const acc = {};
  const keys = Object.keys(helpers);
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    acc[key] = helpers[key](ctx);
  }
  return acc;
}

const createValidation = ctx => msg =>
  function validation(predicate) {
    if (typeof predicate !== "function") return predicate;
    return (...args) => {
      const out = predicate(...args);
      if (out === false) {
        ctx.reportError(msg, ...args);
      }
      return out;
    };
  };

const _rawHelpers = {
  Email,
  Xc,
  Nc,
  Lc,
  Uc,
  Lc,
  LUc,
  btw: createBtw,
  btwe: createBtwe,
  lt: createLt,
  lte: createLte,
  gt: createGt,
  gte: createGte,
  holds: createHolds,
  or: createOr,
  and: createAnd,
  not: createNot,
  obj: createObj,
  val: createVal,
  regx: createRegx,
  entry: createEntry,
  prim: createPrim,
  pred: createPred,
  deep: createDeep,
  extant: createExtant,
  truthy: createTruthy,
  falsey: createFalsey,
  arrArgMatch: createArrArgMatch,
  arrTypeMatch: createArrTypeMatch,
  wildcard: createWildcard,
  strLen: createStrLen,
  arrLen: createArrLen,
  validation: createValidation
};

module.exports = Object.assign(
  // Main export is the configureHelperFunction
  ctx => passContextToHelpers(ctx, _rawHelpers),
  // Merge on all the helpers configured to default
  passContextToHelpers({}, _rawHelpers),
  // Add getter to get unconfigured helpers
  { getRawHelpers: () => _rawHelpers }
);
