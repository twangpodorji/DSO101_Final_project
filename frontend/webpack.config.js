const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { TsconfigPathsPlugin } = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");
const packageJson = require("./package.json");

const mapObject = (object, fn) => {
  const objectified = Object.entries(object).map(fn);
  return Object.assign({}, ...objectified);
};

module.exports = (env) => ({
  mode: "development",
  entry: "./src/index.tsx",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    host: "0.0.0.0",
    port: 10000,
    static: path.resolve(__dirname, "dist"),
    hot: true,
  },
});
