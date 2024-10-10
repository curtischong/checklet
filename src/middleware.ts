// https://github.com/auth0/nextjs-auth0/blob/main/EXAMPLES.md#protecting-a-server-side-rendered-ssr-page
import {
  requestPathHeaderName,
  serializeAuthHeader,
} from "@/networking_helpers";
import { type NextRequest, NextResponse } from "next/server";

import { clientConfig, serverConfig } from "@/firebase/config";
import { type UserCtx } from "@/firebase/edge_env";
import { authMiddleware } from "next-firebase-auth-edge";
import { type DecodedIdToken } from "next-firebase-auth-edge/lib/auth/token-verifier";

export const VALID_ADMIN_SUBJECT_IDS = [
  "google-oauth2|109510116779022719153",
  "google-oauth2|113608005471794303845",
]; // [curtis. eddie]
// const VALID_ADMIN_SUBJECT_IDS = []; // used for testing

const redirectTo = (req: NextRequest, path: string) => {
  const res = NextResponse.redirect(new URL(path, req.url));
  res.headers.set(requestPathHeaderName, path); // this lets route handlers know the path of the request (useful for tracking login counts. if they're coming from the homepage or not)
  return res;
};

const decodedIdTokenToUserCtx = (decodedToken: DecodedIdToken): UserCtx => {
  return {
    id: decodedToken.uid,
    email: decodedToken.email!,
    email_verified: decodedToken.email_verified!,
  };
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is trying to access the "/login" or "/logout" page
  if (pathname === "/login") {
    // Redirect to the actual sign-in page
    return redirectTo(request, "/signin");
  }

  if (pathname === "/logout") {
    // Redirect to the actual sign-out page
    return redirectTo(request, "/signout");
  }

  // const res = NextResponse.next();
  // serializeAuthHeader(res, userCtx);

  // Then, we call /api/login endpoint exposed by the middleware. This endpoint updates our browser cookies with user credentials.

  // Default auth middleware behavior for other paths
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    cookieSerializeOptions: serverConfig.cookieSerializeOptions,
    serviceAccount: serverConfig.serviceAccount as any, // NOTE: serviceAccount may not be typed property. I think it MAY NOT be always known. if you remove the as any, you'll see.
    // debug: process.env.NODE_ENV === "development",
    // eslint-disable-next-line @typescript-eslint/require-await
    handleValidToken: async ({ token: _token, decodedToken }, headers) => {
      // by serializing the auth header, we can pass the user's info to server-side-components
      // I got the idea after reading the first comment: https://stackoverflow.com/questions/78312633/how-to-get-firebase-auth-id-token-in-server-component-in-nextjs-firebase
      serializeAuthHeader(headers, decodedIdTokenToUserCtx(decodedToken));
      headers.set(requestPathHeaderName, pathname); // needed for analytics (tells us which page the user is on)
      return NextResponse.next({
        request: {
          headers,
        },
      });
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    handleInvalidToken: async (_reason) => {
      if (pathname === "/dashboard") {
        return redirectTo(request, "/signin?redirect-reason=create-checker");
      }
      if (pathname.endsWith("/edit")) {
        return redirectTo(
          request,
          pathname.substring(0, pathname.length - "/edit".length),
        );
      }

      const res = NextResponse.next();
      res.headers.set(requestPathHeaderName, pathname);
      return res;
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    handleError: async (_error) => {
      const res = NextResponse.next();
      res.headers.set(requestPathHeaderName, pathname);
      return res;
    },
  });
}
