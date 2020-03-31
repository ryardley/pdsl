import { createErrorReporter } from "./error-reporter";

/**
 * <h3>Less than</h3>
 * Return a function that checks to see if it's input is less than the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
export const createLt = ctx =>
  function lt(a) {
    return function ltFn(n, msg?) {
      return createErrorReporter("lt", ctx, msg, [n, a])(() => {
        return n < a;
      });
    };
  };
