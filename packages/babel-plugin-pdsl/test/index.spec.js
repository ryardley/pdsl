const pluginTester = require("babel-plugin-tester");
const plugin = require("../src");
const path = require("path");
const fs = require("fs");

function loadFixtureSync(folder) {
  const code = fs.readFileSync(
    path.resolve(__dirname, `./fixtures/${folder}/code.js.txt`),
    "utf-8"
  );

  const output = fs.readFileSync(
    path.resolve(__dirname, `./fixtures/${folder}/output.js.txt`),
    "utf-8"
  );

  return { code, output };
}

const tests = [
  {
    title: "Kitchen Sinc",
    ...loadFixtureSync("kitchen-sinc")
  },
  {
    title: "Multiple helper imports",
    ...loadFixtureSync("multiple-helpers")
  }
];
pluginTester({
  plugin,
  tests
});

test("The code runs as expected", () => {
  tests.forEach(({ output }) => {
    expect(() => {
      eval(output);
    }).not.toThrow();
  });
});
