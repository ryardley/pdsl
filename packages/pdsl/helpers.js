const {
  identity,
  isDeepVal,
  isFunction,
  isPrimative,
  isRegEx
} = require("./utils");

/**
 * Return a function that checks to see if it's input is between two numbers not including the numbers.
 *
 * @param {number} a The lower number
 * @param {number} b The higher number
 * @return {function} A function of the form number => boolean
 */
const btw = (a, b) =>
  function btwFn(n) {
    return n > a && n < b;
  };

/**
 * Return a function that checks to see if it's input is between two numbers including the numbers.
 *
 * @param {number} a The lower number
 * @param {number} b The higher number
 * @return {function} A function of the form number => boolean
 */
const btwe = (a, b) =>
  function btweFn(n) {
    return n >= a && n <= b;
  };

/**
 * Return a function that checks to see if it's input is less than the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
const lt = a =>
  function ltFn(n) {
    return n < a;
  };

/**
 * Return a function that checks to see if it's input is less than or equal to the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
const lte = a =>
  function lteFn(n) {
    return n <= a;
  };

/**
 * Return a function that checks to see if it's input is greater than the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
const gt = a =>
  function gtFn(n) {
    return n > a;
  };

/**
 * Return a function that checks to see if it's input is greater than or equal to the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
const gte = a =>
  function gteFn(n) {
    return n >= a;
  };

/**
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
const holds = (...args) =>
  function holdsFn(n) {
    let i, j;
    let fns = [];
    let success = [];

    // prepare args as an array of predicate fns and an array to keep track of success
    for (i = 0; i < args.length; i++) {
      const arg = args[i];
      const fn = typeof arg === "function" ? arg : a => a === arg;
      fns.push(fn);
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
 * Combine predicates to form a new predicate that ORs the result of the input predicates.
 *
 * @param {function} left The first predicate
 * @param {function} right The second predicate
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const or = (left, right) =>
  function orFn(a) {
    return left(a) || right(a);
  };

/**
 * Combine predicates to form a new predicate that ANDs the result of the input predicates.
 *
 * @param {function} left The first predicate
 * @param {function} right The second predicate
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const and = (left, right) =>
  function andFn(a) {
    return left(a) && right(a);
  };

/**
 * Takes an input predicate to form a new predicate that NOTs the result of the input predicate.
 *
 * @param {function} input The input predicate
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const not = input =>
  function notFn(a) {
    return !input(a);
  };

const obj = (...entries) =>
  function objFn(a) {
    return entries.reduce(
      (acc, [key, predicate]) => acc && Boolean(a) && predicate(a[key]),
      true
    );
  };

/**
 * Takes an input value to form a predicate that checks if the input strictly equals by reference the value.
 *
 * @param {function} value The input value
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const val = value =>
  function isVal(a) {
    return a === value;
  };

/**
 * Takes an input value to form a predicate that checks if the input deeply equals the value.
 *
 * @param {function} value The input value
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const deep = value => {
  const st = JSON.stringify(value);
  return a => st === JSON.stringify(a);
};

/**
 * Forms a predicate from a given regular expression
 *
 * @param {RegExp} rx The input value
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
const regx = rx => rx.test.bind(rx);

/**
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
const prim = primative => {
  if (primative.name === "Array") return a => Array.isArray(a);

  return a => typeof a === primative.name.toLowerCase();
};

function createExpressionParser(expression) {
  if (isFunction(expression)) {
    if (isPrimative(expression)) return prim;
    return identity;
  }
  if (isRegEx(expression)) return regx;
  if (isDeepVal(expression)) return deep;
  return val;
}

/**
 * Creates an appropriate predicate based on an input value. This will choose a predicate transformer dynamically based on the type of input.
 *
 * @param {*} input Anything parsable
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
function pred(input) {
  const expParser = createExpressionParser(input);
  return expParser(input);
}

const Email = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]+)$/;

module.exports = {
  Email,
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
  prim,
  pred,
  deep
};
