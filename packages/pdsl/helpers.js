const btw = (a, b) =>
  function btwFn(n) {
    return n > a && n < b;
  };

const btwi = (a, b) =>
  function btwiFn(n) {
    return n >= a && n <= b;
  };

const lt = a =>
  function ltFn(n) {
    return n < a;
  };

const lte = a =>
  function lteFn(n) {
    return n <= a;
  };

const gt = a =>
  function gtFn(n) {
    return n > a;
  };

const gte = a =>
  function gteFn(n) {
    return n >= a;
  };

const has = (...args) =>
  function hasFn(n) {
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

const or = (left, right) =>
  function orFn(a) {
    return left(a) || right(a);
  };

const and = (left, right) =>
  function andFn(a) {
    return left(a) && right(a);
  };

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

const Email = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]+)$/;

module.exports = { Email, btw, btwi, lt, lte, gt, gte, has, or, and, not, obj };
