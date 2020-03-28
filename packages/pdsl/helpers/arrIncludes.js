const { createErrorReporter } = require("./error-reporter");
const { createVal } = require("./val");

/**
 * <h3>Array arrIncl</h3>
 * Return a function that checks to see if an array contains either any of the values listed or if any of the predicate functions provided return true when run over all items in the array.
 * Eg,
 * <pre><code>
 * arrIncl(a => a > 3, 2)([1,2,3]); // true
 * arrIncl(1, 2)([1,3]); // false
 * </code></pre>
 *
 * @param {...function|*} args Either values or predicate functions used to test the contents of the array.
 * @return {function} A function of the form <code>{array => boolean}</code>
 */
module.exports.createArrIncludes = ctx =>
  function arrIncl(...args) {
    return function holdsFn(n, msg) {
      return createErrorReporter("arrIncl", ctx, msg, [n, ...args])(() => {
        let i, j;
        let fns = [];
        let success = [];

        // prepare args as an array of predicate fns and an array to keep track of success
        for (i = 0; i < args.length; i++) {
          const arg = args[i];
          fns.push(createVal(ctx)(arg));
          success.push(false);
        }

        // loop through array only once
        for (i = 0; i < n.length; i++) {
          const item = n[i];
          for (j = 0; j < fns.length; j++) {
            if (!success[j]) {
              const fn = fns[j];
              success[j] = success[j] || fn(item);
            }
          }
        }

        return success.reduce((a, b) => a && b);
      });
    };
  };
