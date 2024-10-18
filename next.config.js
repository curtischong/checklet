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

  // eslint-disable-next-line @typescript-eslint/require-await
  async headers() {
    return [
      {
        // This will apply the COOP header to all routes
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin", // Allows cross-origin popups
          },
          // {
          //   key: "Cross-Origin-Opener-Policy",
          //   value: "unsafe-none",
          // },
        ],
      },
    ];
  },
};

export default config;
