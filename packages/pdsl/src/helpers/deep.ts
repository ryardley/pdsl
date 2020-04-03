import { createErrorReporter } from "./error-reporter";

/**
 * <h3>Is deep equal to value</h3>
 * Takes an input value to form a predicate that checks if the input deeply equals the value.
 *
 * @param {function} value The input value
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
export const createDeep = ctx =>
  function deep(value) {
    const st = JSON.stringify(value);
    return function isDeepEquals(a, msg?) {
      return createErrorReporter("deep", ctx, msg, [a, st])(() => {
        return st === JSON.stringify(a);
      });
    };
  };
