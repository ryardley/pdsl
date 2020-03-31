import { createErrorReporter } from "./error-reporter";

/**
 * <h3>Regular Expression predicate</h3>
 * Forms a predicate from a given regular expression
 *
 * @param {RegExp} rx The input value
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
export const createRegx = ctx =>
  function regx(rx) {
    const rgx = typeof rx === "function" ? rx(ctx) : rx;
    return function testRegx(a, msg?) {
      return createErrorReporter("regx", ctx, msg, [a, rx])(() => {
        return rgx.test(a);
      });
    };
  };

export const Email = () =>
  /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]+)$/;
export const Xc = () => /(?=.*[^a-zA-Z0-9\s]).*/;
export const Nc = () => /(?=.*[0-9]).*/;
export const Lc = () => /(?=.*[a-z]).*/;
export const Uc = () => /(?=.*[A-Z]).*/;
export const LUc = () => /(?=.*[a-z])(?=.*[A-Z]).*/;
