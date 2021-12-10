import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";

const uglify = require("rollup-plugin-uglify");
const pkg = require("./package.json");

export default [
  {
    input: "./dist/lib/index.js",
    output: {
      file: `./dist/index-amd.min.js`,
      format: "amd",
    },
    plugins: [commonjs(), uglify.uglify()],
  },
  {
    input: "./dist/lib/index.js",
    output: {
      file: `./dist/index-cjs.min.js`,
      format: "cjs",
    },
    plugins: [commonjs(), uglify.uglify()],
  },
  {
    input: "./dist/lib/index.js",
    output: {
      file: `./dist/index-iife.min.js`,
      name: "readerLib",
      format: "iife",
    },
    // plugins: [commonjs(), terser()],
    plugins: [
      commonjs(),
      // babel(),
      // uglify.uglify(),
    ],
  },
  {
    input: "./dist/lib/index.js",
    output: {
      file: `./dist/index-umd.min.js`,
      name: "readerLib",
      format: "umd",
    },
    plugins: [commonjs(), uglify.uglify()],
  },
];
// ,
// // {
// //     file: `./dist/index-es.min.js`,
// //     format: "es"
// // },
// {
//     file: `./dist/index-umd.min.js`,
//         name: "bk_dateFormat",
//     format: "umd"
// }
