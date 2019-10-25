const {
  isPrecidenceOperatorClose,
  isPrecidenceOperator,
  isArgumentSeparator,
  isVaradicFunction,
  isVaradicFunctionClose,
  isPredicateLookup,
  isLiteral,
  isOperator,
  tokens,
  grammar
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

test.only("tokens should match the grammar order", () => {
  expect(Object.values(tokens)).toEqual(Object.keys(grammar));
});
