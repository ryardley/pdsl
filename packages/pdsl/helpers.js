const {
  identity,
  isDeepVal,
  isFunction,
  isPrimative,
  isRegEx
} = require("./utils");

/**
 * <h3>Between bounds</h3>
 * Return a function that checks to see if it's input is between two numbers not including the numbers.
 *
 * @param {number} a The lower number
 * @param {number} b The higher number
 * @return {function} A function of the form number => boolean
 */
const btw = () => (a, b) =>
  function btwFn(n) {
    const [min, max] = a < b ? [a, b] : [b, a];
    return n > min && n < max;
  };

/**
 * <h3>Between bounds or equal to</h3>
 * Return a function that checks to see if it's input is between two numbers including the numbers.
 *
 * @param {number} a The lower number
 * @param {number} b The higher number
 * @return {function} A function of the form number => boolean
 */
const btwe = () => (a, b) =>
  function btweFn(n) {
    const [min, max] = a < b ? [a, b] : [b, a];
    return n >= min && n <= max;
  };

/**
 * <h3>Less than</h3>
 * Return a function that checks to see if it's input is less than the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
const lt = () => a =>
  function ltFn(n) {
    return n < a;
  };

/**
 * <h3>Less than or equal to</h3>
 * Return a function that checks to see if it's input is less than or equal to the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
const lte = () => a =>
  function lteFn(n) {
    return n <= a;
  };

/**
 * <h3>Greater than</h3>
 * Return a function that checks to see if it's input is greater than the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
const gt = () => a =>
  function gtFn(n) {
    return n > a;
  };

/**
 * <h3>Greater than or equal to</h3>
 * Return a function that checks to see if it's input is greater than or equal to the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
const gte = () => a =>
  function gteFn(n) {
    return n >= a;
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
const arrArgMatch = ctx => (...tests) => {
  function matchFn(arr) {
    const hasWildcard = tests.slice(-1)[0] === "...";
    let matches = hasWildcard || arr.length === tests.length;
    for (let i = 0; i < tests.length; i++) {
      const testVal = tests[i];
      const predicate = testVal === "..." ? wildcard(ctx) : val(ctx)(testVal);
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
const arrTypeMatch = ctx => test => {
  const predicate = val(ctx)(test);
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
const holds = ctx => (...args) =>
  function holdsFn(n) {
    let i, j;
    let fns = [];
    let success = [];

    // prepare args as an array of predicate fns and an array to keep track of success
    for (i = 0; i < args.length; i++) {
      const arg = args[i];
      fns.push(val(ctx)(arg));
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

/**
 * <h3>Logical OR</h3>
 * Combine predicates to form a new predicate that ORs the result of the input predicates.
 *
 * @param {function} left The first predicate
 * @param {function} right The second predicate
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const or = ctx => (left, right) =>
  function orFn(a) {
    const valCtx = val(ctx);
    return valCtx(left)(a) || valCtx(right)(a);
  };

/**
 * <h3>Logical AND</h3>
 * Combine predicates to form a new predicate that ANDs the result of the input predicates.
 *
 * @param {function} left The first predicate
 * @param {function} right The second predicate
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const and = ctx => (left, right) =>
  function andFn(a) {
    const valCtx = val(ctx);
    return valCtx(left)(a) && valCtx(right)(a);
  };

/**
 * <h3>Logical NOT</h3>
 * Takes an input predicate to form a new predicate that NOTs the result of the input predicate.
 *
 * @param {function} input The input predicate
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const not = ctx => input =>
  function notFn(a) {
    return !val(ctx)(input)(a);
  };

const extant = () => a => a !== null && a !== undefined;

/**
 * <h3>Truthy</h3>
 * A predicate that takes an input value and returns whether or not the value is truthy
 *
 * @param {function} input The input value
 * @return {boolean} Boolean value indicating if the input is truthy
 */
const truthy = () => a => !!a;

/**
 * <h3>Falsey</h3>
 * A predicate that takes an input value and returns whether or not the value is falsey
 *
 * @param {function} input The input value
 * @return {boolean} Boolean value indicating if the input is falsey
 */
const falsey = () => a => !a;

const obj = ctx => (...entriesWithRest) =>
  function objFn(a) {
    const isExtant = extant(ctx);
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
      const [key, predicate] = Array.isArray(entry) ? entry : [entry, isExtant];
      entriesMatch = entriesMatch && isExtant(a) && predicate(a[key]);

      // We just logged an entry track it
      entryCount++;
    }

    // If there was a rest arg we don't need to check length
    if (hasRest) return entriesMatch;

    // Check entry length
    return entriesMatch && Object.keys(a).length === entryCount;
  };

/**
 * <h3>Is strict equal to value</h3>
 * Takes an input value to form a predicate that checks if the input strictly equals by reference the value.
 *
 * @param {function|*} value The input value if already a fuction it will be returned
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const val = () => value =>
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
const deep = () => value => {
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
const regx = ctx => rx => {
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
const prim = () => primative => {
  if (primative.name === "Array") return a => Array.isArray(a);

  return a => typeof a === primative.name.toLowerCase();
};

function createExpressionParser(ctx, expression) {
  if (isFunction(expression)) {
    if (isPrimative(expression)) return prim(ctx);
    return identity;
  }
  if (isRegEx(expression)) return regx(ctx);
  if (isDeepVal(expression)) return deep(ctx);
  return val(ctx);
}

/**
 * <h3>Predicate</h3>
 * Creates an appropriate predicate based on an input value. This will choose a predicate transformer dynamically based on the type of input.
 *
 * @param {*} input Anything parsable
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const pred = ctx => input => {
  const expParser = createExpressionParser(ctx, input);
  return expParser(input);
};

const strLen = ctx => input =>
  function strLenFn(a) {
    return typeof a === "string" && val(ctx)(input)(a.length);
  };

const arrLen = ctx => input =>
  function arrLenFn(a) {
    return Array.isArray(a) && val(ctx)(input)(a.length);
  };

const wildcard = () => () => true;

const entry = ctx => (name, predicate) => {
  return [name, val(ctx)(predicate)];
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

const _rawHelpers = {
  Email,
  Xc,
  Nc,
  Lc,
  Uc,
  Lc,
  LUc,
  btw,
  btwe,
  lt,
  lte,
  gt,
  gte,
  holds,
  or,
  and,
  not,
  obj,
  val,
  regx,
  entry,
  prim,
  pred,
  deep,
  extant,
  truthy,
  falsey,
  arrArgMatch,
  arrTypeMatch,
  wildcard,
  strLen,
  arrLen
};

module.exports = Object.assign(
  // Main export is the configureHelperFunction
  ctx => passContextToHelpers(ctx, _rawHelpers),
  // Merge on all the helpers configured to default
  passContextToHelpers({}, _rawHelpers),
  // Add getter to get unconfigured helpers
  { getRawHelpers: () => _rawHelpers }
);
