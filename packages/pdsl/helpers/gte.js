const { createErrorReporter } = require("./error-reporter");

/**
 * <h3>Greater than or equal to</h3>
 * Return a function that checks to see if it's input is greater than or equal to the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
module.exports.createGte = ctx =>
  function gte(a) {
    return function gteFn(n, msg) {
      return createErrorReporter("gte", ctx, msg, [n, a])(() => {
        return n >= a;
      });
    };
  };
