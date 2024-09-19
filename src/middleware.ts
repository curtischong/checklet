// https://github.com/auth0/nextjs-auth0/blob/main/EXAMPLES.md#protecting-a-server-side-rendered-ssr-page
import { serializeAuthHeader } from "@/networking_helpers";
import { FORBIDDEN } from "@/utils/status_codes";
import { type NextRequest, NextResponse } from "next/server";

import { authMiddleware } from "next-firebase-auth-edge";
import { clientConfig, serverConfig } from "@/firebase/config";
import { type UserCtx } from "@/firebase/edge_env";
import { type DecodedIdToken } from "next-firebase-auth-edge/lib/auth/token-verifier";

const adminPagePrefix = "/admin";
const adminApiPrefix = "/api/authenticated/admin";

export const VALID_ADMIN_SUBJECT_IDS = [
  "google-oauth2|109510116779022719153",
  "google-oauth2|113608005471794303845",
]; // [curtis. eddie]
// const VALID_ADMIN_SUBJECT_IDS = []; // used for testing
const ADMIN_PATHS = [adminPagePrefix, adminApiPrefix];

const errorResponse = (message: string, headers: Headers) => {
  headers.set("Content-Type", "application/json");
  return NextResponse.json(
    {
      message: message,
    },
    {
      status: FORBIDDEN,
    },
  );
};

const isAdminPath = (path: string) => {
  for (const adminPath of ADMIN_PATHS) {
    if (path.startsWith(adminPath)) {
      return true;
    }
  }
  return false;
};

const redirectTo = (req: NextRequest, path: string) => {
  return NextResponse.redirect(new URL(path, req.url));
};

const decodedIdTokenToUserCtx = (decodedToken: DecodedIdToken): UserCtx => {
  return {
    id: decodedToken.uid,
    email: decodedToken.email!,
    email_verified: decodedToken.email_verified!,
  };
};

const getIsInvalidAdminResponse = (
  req: NextRequest,
  res: NextResponse,
  userCtx: UserCtx,
) => {
  const requestPath = req.nextUrl.pathname;
  const isFetchingAdminPage = requestPath.startsWith(adminPagePrefix);
  if (isFetchingAdminPage) {
    return redirectTo(req, "/u/home"); // just send them to a different page (if they are not an admin)
  }

  const isQueryingAdminAPi = requestPath.startsWith(adminApiPrefix);
  if (isQueryingAdminAPi) {
    return errorResponse("You cannot query admin APIs!", res.headers);
  }

  console.error(
    `user ${userCtx.id} is accessing an unknown admin endpoint: ${requestPath}! We need to handle this case!`,
  );
  return errorResponse(
    "You do not have access to this admin endpoint!",
    res.headers,
  );
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is trying to access the "/login" or "/logout" page
  if (pathname === "/login") {
    // Redirect to the actual sign-in page
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (pathname === "/logout") {
    // Redirect to the actual sign-out page
    return NextResponse.redirect(new URL("/signout", request.url));
  }

  // const res = NextResponse.next();
  // serializeAuthHeader(res, userCtx);

  // Default auth middleware behavior for other paths
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    cookieSerializeOptions: serverConfig.cookieSerializeOptions,
    serviceAccount: serverConfig.serviceAccount,
    handleValidToken: async ({ token, decodedToken }, headers) => {
      const requestPath = request.nextUrl.pathname;
      // if (PUBLIC_PATHS.includes(requestPath)) {
      //   return redirectToHome(request); // simplifies to NextResponse.redirect(new URL(“/“))
      // }

      // // only allow admins to access the admin paths
      // if (isAdminPath(requestPath)) {
      //   const isValidAdmin =
      //     decodedToken.email && VALID_ADMIN_EMAILS.includes(decodedToken.email);

      //   if (!isValidAdmin) {
      //     const isFetchingAdminPage = requestPath.startsWith(adminPagePrefix);
      //     if (isFetchingAdminPage) {
      //       return redirectToHome(request); // just send them to a different page (if they are not an admin)
      //     }

      //     const isQueryingAdminAPi = requestPath.startsWith(adminApiPrefix);
      //     if (isQueryingAdminAPi) {
      //       return errorResponse("You cannot query admin APIs!", headers);
      //     }

      //     console.error(
      //       `user ${decodedToken.uid} is accessing an unknown admin endpoint: ${requestPath}! We need to handle this case!`,
      //     );
      //     return errorResponse(
      //       "You do not have access to this admin endpoint!",
      //       headers,
      //     );
      //   }
      // }

      serializeAuthHeader(headers, decodedIdTokenToUserCtx(decodedToken));
      return NextResponse.next({
        request: {
          headers,
        },
      });
    },
    // handleInvalidToken: async (reason) => {
    //   console.info("Missing or malformed credentials", { reason });

    //   // return redirectToLogin(request, {
    //   //   path: "/login",
    //   //   publicPaths: PUBLIC_PATHS,
    //   // });
    // },
    // handleError: async (error) => {
    //   console.error("Unhandled authentication error", { error });
    //   // return redirectToLogin(request, {
    //   //   path: "/login",
    //   //   publicPaths: PUBLIC_PATHS,
    //   // });
    // },
  });
}

export const config = {
  matcher: ["/", "/((?!_next|api|.*\\.).*)", "/api/login", "/api/logout"],
};

// // all requests that requre authentication go through this middleware
// // I tried to get mixpanel tracking to be IN THIS MIDDLEWARE layer (so we don't need to put it in every page)
// // but it didn't work. Another problem with putting middleware here is that withMiddlewareAuthRequired only handles
// // authenticated pages. but if we want to track public pages, we'd still need to put the tracking code in each page
// export default withMiddlewareAuthRequired(async function middleware(req) {
//     const res = NextResponse.next();

//     const requestPath = req.nextUrl.pathname;
//     res.headers.set(requestPathHeaderName, requestPath); // this lets route handlers know the path of the request (useful for tracking login counts. if they're coming from the homepage or not)

//     const session = await getSession(req, res);

//     if (!session || !session.user) {
//         return redirectTo(req, "/");
//     }

//     const userCtx = getUserCtxFromUserClaims(session.user);

//     if (isAdminPath(requestPath)) {
//         const isValidAdmin = VALID_ADMIN_SUBJECT_IDS.includes(userCtx.id);
//         if (!isValidAdmin) {
//             return getIsInvalidAdminResponse(req, res, userCtx);
//         }
//     }

//     serializeAuthHeader(res, userCtx);

//     return res;
// });

// export const config = {
//     matcher: [
//         // DEPRECATED: "/((?!_next|api|.*\\.).*)", // matches any string that does not contain: "_next", "api", or ".*"
//         "/admin/",
//         "/api/authenticated/:path*", // matches any path that starts with "api/authenticated" // from: https://stackoverflow.com/a/73144530/4647924
//         "/u/:path*", // matches any path that starts with "u/". This way, all the user pages are protected by the middleware.
//     ],
// };
