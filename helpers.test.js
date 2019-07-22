const { Email, btw, btwi, lt, lte, gt, gte, has, obj } = require("./helpers");

it("should obj", () => {
  expect(
    obj(["name", a => a === "foo"], ["age", a => a === 41])({
      name: "foo",
      age: 41
    })
  ).toBe(true);
});

it("should Email", () => {
  expect(Email.test("foo@bar.com")).toBe(true);
  expect(Email.test("hello")).toBe(false);
});

it("should btw", () => {
  expect(btw(10, 100)(50)).toBe(true);
  expect(btw(10, 100)(-50)).toBe(false);
  expect(btw(10, 100)(100)).toBe(false);
  expect(btw(10, 100)(10)).toBe(false);
});

it("should btwi", () => {
  expect(btwi(10, 100)(50)).toBe(true);
  expect(btwi(10, 100)(-50)).toBe(false);
  expect(btwi(10, 100)(100)).toBe(true);
  expect(btwi(10, 100)(10)).toBe(true);
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

it("should has", () => {
  expect(has(10)([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(true);
  expect(has(10)([1, 2, 3, 4, 5, 6, 7, 8, 9, 9])).toBe(false);
});
