import typescript from "rollup-plugin-typescript2";

const config = {
  watch: {
    include: "src/**"
  },
  plugins: [typescript({ rollupCommonJSResolveHack: false, clean: true })]
};

export default [
  {
    input: "./src/helpers/index.ts",
    output: {
      file: "./helpers.js",
      name: "helpers",
      format: "cjs",
      exports: "named"
    },
    ...config
  },
  {
    input: "./src/lib/index.ts",
    output: {
      file: "./lib.js",
      name: "lib",
      format: "cjs",
      exports: "named"
    },
    ...config
  }
];
