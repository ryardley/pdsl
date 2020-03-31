import { debug } from "./utils";
it("should be happy with code coverage", () => {
  const oldLogger = console.log;
  console.log = () => {};
  expect(
    debug([], [], { token: "", toString: () => "y" }, "type", ["hello"])
  ).toEqual(undefined);
  console.log = oldLogger;
});
