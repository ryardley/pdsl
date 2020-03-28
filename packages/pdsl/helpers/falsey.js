const { createErrorReporter } = require("./error-reporter");

/**
 * <h3>Falsey</h3>
 * A predicate that takes an input value and returns whether or not the value is falsey
 *
 * @param {function} input The input value
 * @return {boolean} Boolean value indicating if the input is falsey
 */
module.exports.createFalsey = ctx =>
  function falsey(a, msg) {
    return createErrorReporter("falsey", ctx, msg, [a])(() => {
      return !a;
    });
  };
