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

const has = a =>
  function hasFn(n) {
    return n.indexOf(a) !== -1;
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
