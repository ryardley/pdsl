const {
  isPrecidenceOperatorClose,
  isPrecidenceOperator,
  isArgumentSeparator,
  isVaradicFunction,
  isVaradicFunctionClose,
  isPredicateLookup,
  isLiteral,
  isOperator
} = require("./grammar");

describe("operator predicates", () => {
  [
    isPrecidenceOperatorClose,
    isPrecidenceOperator,
    isArgumentSeparator,
    isVaradicFunction,
    isVaradicFunctionClose,
    isPredicateLookup,
    isLiteral,
    isOperator
  ].forEach(p => {
    it("should return false for falsy input", () => {
      expect(p()).toBe(false);
    });
  });
});
