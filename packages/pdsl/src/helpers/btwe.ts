import { createErrorReporter } from "./error-reporter";
/**
 * <h3>Between bounds or equal to</h3>
 * Return a function that checks to see if it's input is between two numbers including the numbers.
 *
 * @param {number} a The lower number
 * @param {number} b The higher number
 * @return {function} A function of the form number => boolean
 */
export const createBtwe = ctx =>
  function btwe(a, b) {
    return function btweFn(n, msg?) {
      return createErrorReporter("btwe", ctx, msg, [n, a, b])(() => {
        const [min, max] = a < b ? [a, b] : [b, a];
        return n >= min && n <= max;
      });
    };
  };
