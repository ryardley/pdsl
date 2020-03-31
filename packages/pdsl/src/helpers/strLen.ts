import { createErrorReporter } from "./error-reporter";
import { createVal } from "./val";

export const createStrLen = ctx =>
  function strLen(input) {
    return function strLenFn(a, msg?) {
      return createErrorReporter(
        "strLen",
        ctx,
        msg,
        [a, input],
        true // block downstream
      )(() => {
        return typeof a === "string" && createVal(ctx)(input)(a.length);
      });
    };
  };
