import { createErrorReporter } from "./error-reporter";
/**
 * <h3>Truthy</h3>
 * A predicate that takes an input value and returns whether or not the value is truthy
 *
 * @param {function} input The input value
 * @return {boolean} Boolean value indicating if the input is truthy
 */
export const createTruthy = ctx =>
  function truthy(a, msg?) {
    return createErrorReporter("truthy", ctx, msg, [a])(() => {
      return !!a;
    });
  };
