const path = require("path");

const rootConfig = {
  mode: "development",
  optimization: {
    usedExports: true, // tells webpack to tree-shake
  },
  devtool: "eval-source-map",
};

const appConfig = {
  ...rootConfig,
  entry: {
    index: "./src/index.js",
  },
  output: {
    filename: "library.bundle.js",
    path: path.resolve(__dirname, "public/scripts"),
  },
};

module.exports = [appConfig];
