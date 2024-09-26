import { type UserCtx } from "@/firebase/edge_env";
import { requestPathHeaderName } from "@/networking_helpers";
import { init } from "mixpanel";
import { headers } from "next/headers";

// https://docs.mixpanel.com/docs/tracking-methods/sdks/nodejs
const projectToken = process.env.MIXPANEL_PROJECT_TOKEN;
if (!projectToken) {
  throw new Error("MIXPANEL_PROJECT_TOKEN environment variable not set");
}
export const mixpanel = init(projectToken, {
  geolocate: false, // when false, Mixpanel infers the location based on the ip property provided in the event payload.
});

const getIpAddress = () => {
  const headersList = headers();
  const xForwardedFor = headersList.get("x-forwarded-for");
  const ip = xForwardedFor ? xForwardedFor.split(",")[0] : undefined;
  return ip;
};

const getPagePath = () => {
  const headersList = headers();
  return headersList.get(requestPathHeaderName) ?? "/"; // this header is set in the middleware
};

export const trackPageView = (userCtx?: UserCtx) => {
  const ip = getIpAddress();
  const path = getPagePath();
  mixpanel.track("Page View", {
    path,
    ip,
    email: userCtx?.email,
    userId: userCtx?.id,
  });
};
