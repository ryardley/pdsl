import { createErrorReporter } from "./error-reporter";

/**
 * <h3>Greater than</h3>
 * Return a function that checks to see if it's input is greater than the given number.
 *
 * @param {number} a The number to check against.
 * @return {function} A function of the form number => boolean
 */
export const createGt = ctx =>
  function gt(a) {
    return function gtFn(n, msg?) {
      return createErrorReporter("gt", ctx, msg, [n, a])(() => {
        return n > a;
      });
    };
  };
