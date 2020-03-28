const { createErrorReporter } = require("./error-reporter");
const { createVal } = require("./val");
/**
 * <h3>Logical AND</h3>
 * Combine predicates to form a new predicate that ANDs the result of the input predicates.
 *
 * @param {function} left The first predicate
 * @param {function} right The second predicate
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
module.exports.createAnd = ctx =>
  function and(left, right) {
    return function andFn(a, msg) {
      return createErrorReporter(
        "and",
        ctx,
        msg,
        [a, left, right],
        false, // dont block downstream
        true // disable default
      )(() => {
        const val = createVal(ctx);
        return val(left)(a) && val(right)(a);
      });
    };
  };
