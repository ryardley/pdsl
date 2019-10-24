const {
  btw,
  btwe,
  deep,
  Email,
  gt,
  gte,
  holds,
  lt,
  lte,
  obj,
  regx,
  prim,
  val,
  extant,
  arrArgMatch
} = require("./helpers");

it("should obj", () => {
  expect(
    obj(["name", a => a === "foo"], ["age", a => a === 41])({
      name: "foo",
      age: 41
    })
  ).toBe(true);
});

it("should extant", () => {
  expect(extant(false)).toBe(true);
  expect(extant(undefined)).toBe(false);
  expect(extant(null)).toBe(false);
});

it("should Email", () => {
  expect(Email.test("foo@bar.com")).toBe(true);
  expect(Email.test("hello")).toBe(false);
});

it("should btw", () => {
  expect(btw(10, 100)(50)).toBe(true);
  expect(btw(10, 100)(-50)).toBe(false);
  expect(btw(100, 10)(-50)).toBe(false);
  expect(btw(10, 100)(100)).toBe(false);
  expect(btw(10, 100)(10)).toBe(false);
});

it("should btwe", () => {
  expect(btwe(10, 100)(50)).toBe(true);
  expect(btwe(100, 10)(50)).toBe(true);
  expect(btwe(10, 100)(-50)).toBe(false);
  expect(btwe(10, 100)(100)).toBe(true);
  expect(btwe(10, 100)(10)).toBe(true);
});

it("should lt", () => {
  expect(lt(10)(10)).toBe(false);
  expect(lt(10)(50)).toBe(false);
  expect(lt(10)(-50)).toBe(true);
});

it("should lte", () => {
  expect(lte(10)(10)).toBe(true);
  expect(lte(10)(50)).toBe(false);
  expect(lte(10)(-50)).toBe(true);
});

it("should gt", () => {
  expect(gt(10)(10)).toBe(false);
  expect(gt(10)(50)).toBe(true);
  expect(gt(10)(-50)).toBe(false);
});

it("should gte", () => {
  expect(gte(10)(10)).toBe(true);
  expect(gte(10)(50)).toBe(true);
  expect(gte(10)(-50)).toBe(false);
});

it("should holds", () => {
  expect(holds(10)([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(true);
  expect(holds(10)([1, 2, 3, 4, 5, 6, 7, 8, 9, 9])).toBe(false);
  expect(holds(3, 10)([1, 2, 3, 10])).toBe(true);
  expect(holds(3, 10)([1, 2, 3])).toBe(false);
  expect(holds(3, 10)([1, 2])).toBe(false);
  expect(holds(gt(3))([4])).toBe(true);
  expect(holds(gt(3), 1)([1, 4])).toBe(true);
  expect(holds(gt(3), 1)([4])).toBe(false);
});

it("should val", () => {
  expect(val(10)(10)).toBe(true);
  expect(val(10)(50)).toBe(false);
});

it("should deep", () => {
  expect(deep(10)(10)).toBe(true);
  expect(deep({ a: "foo", b: "bar" })({ a: "foo", b: "bar", c: 12 })).toBe(
    false
  );
  expect(deep({ a: "foo", b: "bar" })({ a: "foo", b: "bar" })).toBe(true);
});

it("should regex", () => {
  expect(regx(/^foo/)("food")).toBe(true);
  expect(regx(/^foo/)("thing")).toBe(false);
});

it("should prim", () => {
  expect(prim(Number)(10)).toBe(true);
  expect(prim(Number)("10")).toBe(false);
  expect(prim(Array)([10])).toBe(true);
  expect(prim(Array)(10)).toBe(false);
});

it("should arrArgMatch", () => {
  const isNumeric = a => typeof a === "number";
  const isString = a => typeof a === "string";
  expect(arrArgMatch(isNumeric)([1])).toBe(true);
  expect(arrArgMatch(isNumeric)([1, 2])).toBe(false);
  expect(arrArgMatch(isNumeric, isNumeric)([1, 2])).toBe(true);
  expect(arrArgMatch(isNumeric, isNumeric)([1])).toBe(false);
  expect(arrArgMatch(isString)([1])).toBe(false);
  expect(arrArgMatch(isString)(["1"])).toBe(true);
  expect(arrArgMatch(1)([1])).toBe(true);
  expect(arrArgMatch(1)(["1"])).toBe(false);

  // With wildcard
  expect(arrArgMatch(1, "...")([1, 2, "foo"])).toBe(true);
  expect(arrArgMatch(1, "...")([2, 2, "foo"])).toBe(false);
  expect(arrArgMatch("...")([2, 2, "foo"])).toBe(true);
  expect(arrArgMatch(1, "...")([1, "two", "three", "ten"])).toBe(true);
});
