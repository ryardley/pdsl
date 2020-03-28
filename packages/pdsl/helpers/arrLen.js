const { createErrorReporter } = require("./error-reporter");
const { createVal } = require("./val");

module.exports.createArrLen = ctx =>
  function arrLen(input) {
    return function arrLenFn(a, msg) {
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
