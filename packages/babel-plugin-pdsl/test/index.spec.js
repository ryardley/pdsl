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

// White space is really annoying in these not sure if its
// possible to do anythinng about it
const tests = [
  {
    title: "Kitchen Sinc",
    ...loadFixtureSync("kitchen-sinc"),
    runoutput: true
  },
  {
    title: "Import named specifier",
    ...loadFixtureSync("import-named-specifier")
  },
  {
    title: "Import default specifier",
    ...loadFixtureSync("import-default-specifier-schema")
  },
  {
    title: "Basic default schema",
    ...loadFixtureSync("basic-default-schema")
  },
  {
    title: "Basic configured schema",
    ...loadFixtureSync("basic-configured-schema")
  },
  {
    title: "Basic named specifier",
    ...loadFixtureSync("basic-named-specifier")
  }
];
pluginTester({
  plugin,
  tests,
  endOfLine: "preserve"
});

test("The code runs as expected", () => {
  tests.forEach(({ output, runOutput }) => {
    if (runOutput) {
      expect(() => {
        eval(output);
      }).not.toThrow();
    }
  });
});
