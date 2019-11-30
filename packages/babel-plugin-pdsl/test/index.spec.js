const pluginTester = require("babel-plugin-tester");
const plugin = require("../src");
const path = require("path");
const fs = require("fs");

const code = fs.readFileSync(
  path.resolve(__dirname, "./fixtures/pdsl/code.js.txt"),
  "utf-8"
);

const output = fs.readFileSync(
  path.resolve(__dirname, "./fixtures/pdsl/output.js.txt"),
  "utf-8"
);

pluginTester({
  plugin,
  tests: [
    {
      title: "The code transpiles as expected",
      code,
      output
    }
  ]
});

test("The code runs as expected", () => {
  expect(() => {
    eval(output);
  }).not.toThrow();
});
