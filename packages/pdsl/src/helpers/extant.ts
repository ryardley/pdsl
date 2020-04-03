import { createErrorReporter } from "./error-reporter";

export const createExtant = ctx =>
  function extant(a, msg?) {
    return createErrorReporter("extant", ctx, msg, [a])(() => {
      return a !== null && a !== undefined;
    });
  };
