const { createErrorReporter } = require("./error-reporter");
const { createVal } = require("./val");
/**
 * <h3>Logical NOT</h3>
 * Takes an input predicate to form a new predicate that NOTs the result of the input predicate.
 *
 * @param {function} input The input predicate
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
module.exports.createNot = ctx =>
  function not(input) {
    return function notFn(a, msg) {
      return createErrorReporter("not", ctx, msg, [input, a])(() => {
        return !createVal(ctx)(input)(a);
      });
    };
  };
