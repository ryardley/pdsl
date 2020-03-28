const { createErrorReporter } = require("./error-reporter");
const { createVal } = require("./val");
const { createWildcard } = require("./wildcard");

/**
 * <h3>Array match</h3>
 * Return a function that checks to see if an array contains either any of the values listed or if any of the predicate functions provided return true when run over all items in the array.
 * Eg,
 * <pre><code>
 * // Helper functions
 * const isNumeric = a => typeof a === 'number';
 * const isString = a => typeof a === 'string';
 *
 * arrArgMatch(isNumeric, isNumeric, isNumeric)([1,2,3]); // true
 * arrArgMatch(isNumeric, isNumeric, isNumeric, '...')([1,2,3]); // true
 * arrArgMatch(isString, isNumeric, isNumeric, '...')([1,2,3]); // false
 * arrArgMatch(isString, isNumeric, isNumeric, '...')(['1',2,3]); // true
 * arrArgMatch(isNumeric, isNumeric, isNumeric, '...')([1,2,3,4]); // true
 * arrArgMatch(1, 2)([1,3]); // false
 * </code></pre>
 *
 * @param {...function|*} tests Either values, `['...', predicate]` or predicate functions used to test the contents of the array.
 * @return {function} A function of the form <code>{array => boolean}</code>
 */
module.exports.createArrArgMatch = ctx =>
  function arrArgMatch(...tests) {
    return function matchFn(arr, msg) {
      return createErrorReporter("arrArgMatch", ctx, msg, [arr])(() => {
        const hasWildcard = tests.slice(-1)[0] === "...";
        let matches = hasWildcard || arr.length === tests.length;
        for (let i = 0; i < tests.length; i++) {
          const testVal = tests[i];
          const predicate =
            testVal === "..." ? createWildcard(ctx) : createVal(ctx)(testVal);
          const pass = predicate(arr[i]);
          matches = matches && pass;
        }
        return matches;
      });
    };
  };
