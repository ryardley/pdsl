const { createErrorReporter } = require("./error-reporter");

module.exports.createExtant = ctx =>
  function extant(a, msg) {
    return createErrorReporter("extant", ctx, msg, [a])(() => {
      return a !== null && a !== undefined;
    });
  };
