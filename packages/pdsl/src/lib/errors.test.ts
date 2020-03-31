import { ValidationError } from "./errors";

it("should hold information", () => {
  const err = new ValidationError();
  expect(err.name).toBe("ValidationError");
  expect(err.message).toBe("");
  expect(err.path).toBe("");
  expect(err.inner).toEqual([]);

  const err2 = new ValidationError("");
  expect(err2.name).toBe("ValidationError");
  expect(err2.path).toBe("");
  expect(err2.inner).toEqual([]);
});
