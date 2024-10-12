/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-require-imports */
// we use webpack to bundle the entire socket server into a single file for deployment
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./websocket_server.ts",
  output: {
    filename: "bundle.mjs",
    path: path.resolve(__dirname, "dist"),
    library: {
      type: "module", // Set the output library type to 'module'
    },
    chunkFormat: "module", // Specify the chunk format directly
  },
  experiments: {
    outputModule: true, // Enable output as an ES module
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "../src"),
      "@/*": path.resolve(__dirname, "../src/*"),
      //   "@/env": path.resolve(__dirname, "../env.js"),
      //   "@public/*": path.resolve(__dirname, "../public"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.websocket.json", // Specify your tsconfig file here
          },
        },
        exclude: [/node_modules/, /\.d\.ts$/],
      },
    ],
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /express[\/\\]lib/,
      path.resolve(__dirname, "node_modules"),
    ),
  ],
  target: "node18", // Ensure the target is set to a Node.js environment that supports ES modules
  mode: "production", // or 'development' depending on your needs
};
