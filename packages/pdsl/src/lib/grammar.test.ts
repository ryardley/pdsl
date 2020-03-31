import {
  isPrecidenceOperatorClose,
  isPrecidenceOperator,
  isArgumentSeparator,
  isVaradicFunction,
  isVaradicFunctionClose,
  isPredicateLookup,
  isLiteral,
  isOperator,
  grammar
} from "./grammar";

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
      expect(p(undefined)).toBe(false);
    });
  });
});
