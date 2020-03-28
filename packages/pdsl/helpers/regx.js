const { createErrorReporter } = require("./error-reporter");

/**
 * <h3>Regular Expression predicate</h3>
 * Forms a predicate from a given regular expression
 *
 * @param {RegExp} rx The input value
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
module.exports.createRegx = ctx =>
  function regx(rx) {
    const rgx = typeof rx === "function" ? rx(ctx) : rx;
    return function testRegx(a, msg) {
      return createErrorReporter("regx", ctx, msg, [a, rx])(() => {
        return rgx.test(a);
      });
    };
  };

module.exports.Email = () =>
  /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]+)$/;
module.exports.Xc = () => /(?=.*[^a-zA-Z0-9\s]).*/;
module.exports.Nc = () => /(?=.*[0-9]).*/;
module.exports.Lc = () => /(?=.*[a-z]).*/;
module.exports.Uc = () => /(?=.*[A-Z]).*/;
module.exports.LUc = () => /(?=.*[a-z])(?=.*[A-Z]).*/;
