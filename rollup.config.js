// import typescript from '@rollup/plugin-typescript';
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

const dependencies = Object.keys(pkg.dependencies || {});
const peerDependencies = Object.keys(pkg.peerDependencies || {});
const external = [...dependencies, ...peerDependencies];

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "es",
      exports: "named",
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
    }),
  ],
  external,
};
