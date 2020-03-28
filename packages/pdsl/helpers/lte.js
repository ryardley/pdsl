const { createErrorReporter } = require("./error-reporter");

/**
 * <h3>Less than or equal to</h3>
 * Return a function that checks to see if it's input is less than or equal to the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
module.exports.createLte = ctx =>
  function lte(a) {
    return function lteFn(n, msg) {
      return createErrorReporter("lte", ctx, msg, [n, a])(() => {
        return n <= a;
      });
    };
  };
