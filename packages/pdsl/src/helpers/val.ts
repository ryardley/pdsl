import { createErrorReporter } from "./error-reporter";
/**
 * <h3>Is strict equal to value</h3>
 * Takes an input value to form a predicate that checks if the input strictly equals by reference the value.
 *
 * @param {function|*} value The input value if already a fuction it will be returned
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
export const createVal = ctx =>
  function val(value) {
    return typeof value === "function"
      ? value
      : function isVal(a, msg?) {
          return createErrorReporter("val", ctx, msg, [a, value])(() => {
            return a === value;
          });
        };
  };
