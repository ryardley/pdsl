import { createErrorReporter } from "./error-reporter";
/**
 * <h3>Primative predicate</h3>
 * Forms a predicate from a given JavaSCript primative object to act as a typeof check for the input value.
 *
 * Eg. <pre><code>
 * prim(Function)(() => {}); // true
 * prim(Number)(6); // true
 * </code></pre>
 *
 * @param {object} primative The input primative one of Array, Boolean, Number, Symbol, BigInt, String, Function, Object
 * @return {function} A function of the form <code>{any => boolean}</code>
 */
export const createPrim = ctx =>
  function prim(primative) {
    if (primative.name === "Array") {
      return function isArray(a, msg?) {
        return createErrorReporter("prim", ctx, msg, [a, primative.name])(
          () => {
            return Array.isArray(a);
          }
        );
      };
    }
    return function isPrimative(a, msg?) {
      return createErrorReporter("prim", ctx, msg, [a, primative.name])(() => {
        return typeof a === primative.name.toLowerCase();
      });
    };
  };
