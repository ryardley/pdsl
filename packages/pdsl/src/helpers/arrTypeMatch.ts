import { createErrorReporter } from "./error-reporter";
import { createVal } from "./val";
/**
 * <h3>Array type match</h3>
 * Return a function that checks to see if an array contains only the values listed or if the predicate function provided returns true when run over all items in the array.
 * Eg,
 * <pre><code>
 * // Helper functions
 * const isNumeric = a => typeof a === 'number';
 * const isString = a => typeof a === 'string';
 *
 * arrTypeMatch(isNumeric)([1,2,3]); // true
 * arrTypeMatch(isNumeric)([1,2,'3']); // false
 * arrTypeMatch(isNumeric)([]); // true
 * </code></pre>
 *
 * @param {function|*} test predicate function used to test the contents of the array.
 * @return {function} A function of the form <code>{array => boolean}</code>
 */
export const createArrTypeMatch = ctx =>
  function arrTypeMatch(test) {
    const predicate = createVal(ctx)(test);
    return function matchFn(arr, msg?) {
      return createErrorReporter("arrTypeMatch", ctx, msg, [arr])(() => {
        if (!Array.isArray(arr)) return false;

        let matches = true;
        for (let i = 0; i < arr.length; i++) {
          matches = matches && predicate(arr[i]);
        }
        return matches;
      });
    };
  };
