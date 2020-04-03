import { createErrorReporter } from "./error-reporter";
import { createVal } from "./val";
/**
 * <h3>Logical NOT</h3>
 * Takes an input predicate to form a new predicate that NOTs the result of the input predicate.
 *
 * @param {function} input The input predicate
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
export const createNot = ctx =>
  function not(input) {
    return function notFn(a, msg?) {
      return createErrorReporter("not", ctx, msg, [input, a])(() => {
        return !createVal(ctx)(input)(a);
      });
    };
  };
