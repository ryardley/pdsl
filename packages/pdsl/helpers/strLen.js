const { createErrorReporter } = require("./error-reporter");
const { createVal } = require("./val");

module.exports.createStrLen = ctx =>
  function strLen(input) {
    return function strLenFn(a, msg) {
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
