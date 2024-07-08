const path = require("path");

/**@type {import('@types/webpack/index').Configuration} */
const config = {
  resolve: { extensions: [".js", ".ts"] },
  entry: {
    formlib: path.resolve(__dirname, "/src/form-lib/main.ts"),
  },
  output: {
    path: path.resolve(__dirname, "dist/lib"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-typescript"],
        },
      },
    ],
  },
};

module.exports = config;
