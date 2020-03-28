const { createErrorReporter } = require("./error-reporter");
const { createVal } = require("./val");

/**
 * <h3>Logical OR</h3>
 * Combine predicates to form a new predicate that ORs the result of the input predicates.
 *
 * @param {function} left The first predicate
 * @param {function} right The second predicate
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
module.exports.createOr = ctx =>
  function or(left, right) {
    return function orFn(a, msg) {
      return createErrorReporter(
        "or",
        ctx,
        msg,
        [a, left, right],
        false, // dont block downstream
        true // disable default
      )(() => {
        const val = createVal(ctx);
        ctx.batchStart();
        const result = val(left)(a) || val(right)(a);
        if (!result) {
          ctx.batchCommit();
        }
        ctx.batchPurge();
        return result;
      });
    };
  };
