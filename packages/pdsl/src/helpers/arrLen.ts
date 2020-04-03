import { createErrorReporter } from "./error-reporter";
import { createVal } from "./val";

export const createArrLen = ctx =>
  function arrLen(input) {
    return function arrLenFn(a, msg?) {
      return createErrorReporter(
        "arrLen",
        ctx,
        msg,
        [a, input],
        true // block downstream
      )(() => {
        return Array.isArray(a) && createVal(ctx)(input)(a.length);
      });
    };
  };
