import { createErrorReporter } from "./error-reporter";
/**
 * <h3>Between bounds</h3>
 * Return a function that checks to see if it's input is between two numbers not including the numbers.
 *
 * @param {number} a The lower number
 * @param {number} b The higher number
 * @return {function} A function of the form number => boolean
 */
export const createBtw = ctx =>
  function btw(a, b) {
    return function btwFn(n, msg?) {
      return createErrorReporter("btw", ctx, msg, [n, a, b])(() => {
        const [min, max] = a < b ? [a, b] : [b, a];
        return n > min && n < max;
      });
    };
  };
