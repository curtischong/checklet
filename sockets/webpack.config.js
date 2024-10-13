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
      type: "module",
    },
    chunkFormat: "module",
  },
  experiments: {
    outputModule: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "../src"),
      "@/*": path.resolve(__dirname, "../src/*"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.websocket.json",
          },
        },
        exclude: [/node_modules/, /\.d\.ts$/],
      },
    ],
  },
  optimization: {
    minimize: false, // Disable minification for debugging purposes
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /express[\/\\]lib/,
      path.resolve(__dirname, "node_modules"),
    ),
    // // Add DefinePlugin to handle read-only property workarounds
    // new webpack.DefinePlugin({
    //   "process.env": JSON.stringify(process.env),
    // }),
    // new webpack.NormalModuleReplacementPlugin(
    //   /difflib/,
    //   path.resolve(__dirname, "path-to-custom-patched-difflib"),
    // ), // Optional if you want to replace difflib with a patched version
  ],
  target: "node18",
  mode: "production", // Use development for debugging
};
