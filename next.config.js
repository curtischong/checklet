/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  trailingSlash: false,
  reactStrictMode: false, // we need to turn strictmode off because otherwise, refs may BE SET TO NULL on the second render
  // this happens in textbox container. so when we click on a suggestion, the ref of the underline is null so we won't know where to scroll the page to
  // we should probably turn this back on if we are able to fix this bug
};

export default config;
