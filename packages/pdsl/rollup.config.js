import typescript from "rollup-plugin-typescript2";

const config = {
  watch: {
    include: "src/**"
  }
};

const tsconfig = {
  rollupCommonJSResolveHack: false,
  clean: true
};

export default [
  {
    input: "./src/helpers/index.ts",
    output: {
      file: "./helpers/index.js",
      name: "helpers",
      format: "cjs",
      exports: "named"
    },
    plugins: [typescript(tsconfig)],
    ...config
  },
  {
    input: "./src/lib/index.ts",
    output: {
      file: "./index.js",
      name: "lib",
      format: "cjs",
      exports: "named"
    },
    plugins: [
      typescript({
        ...tsconfig,
        tsconfig: "./tsconfig.declarations.json"
      })
    ],
    ...config
  },
  {
    input: "./src/lib/grammar.ts",
    output: {
      file: "./lib/grammar.js",
      name: "lib",
      format: "cjs",
      exports: "named"
    },
    plugins: [typescript(tsconfig)],
    ...config
  }
];
