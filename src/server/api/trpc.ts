/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import serviceAccount from "@/firebase/checkletapp-firebase-adminsdk-25jmk-cd91baf75e.json";
import { serverConfig } from "@/firebase/config";
import { type UserCtx } from "@/firebase/edge_env";
import { db } from "@/server/db";
import { parse } from "cookie";
import admin, { type ServiceAccount } from "firebase-admin";
import { getCookiesTokens } from "next-firebase-auth-edge/lib/next/tokens";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */

// only init the app once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
}

const convertToUserCtx = (user: admin.auth.DecodedIdToken): UserCtx => {
  return {
    id: user.uid,
    email: user.email!,
    email_verified: user.email_verified!,
  };
};

export const createTRPCContext = async (opts: { headers: Headers }) => {
  // const firebaseApp = initializeApp(clientConfig);
  const cookies = opts.headers.get("cookie")!;
  if (!cookies) {
    // there are no cookies. incognito mode? or maybe they're not logged in.
    // it's fine. user will just be null
    return {
      db,
      ...opts,
      user: null,
    };
  }

  // Retrieve tokens using next-firebase-auth-edge
  let tokens;
  try {
    tokens = await getCookiesTokens(parse(cookies), {
      // apiKey: clientConfig.apiKey,
      cookieName: serverConfig.cookieName,
      cookieSignatureKeys: serverConfig.cookieSignatureKeys,
      // cookieSerializeOptions: serverConfig.cookieSerializeOptions,
      // serviceAccount: serverConfig.serviceAccount,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    // console.error("Error getting cookies tokens", _err);
    // there is a high chance this is a InvalidTokenError: MISSING_CREDENTIALS: Missing credentials error
    // basically, the user is not logged in. this is fine. we can just return null

    return {
      db,
      ...opts,
      user: null,
    };
  }

  let user = null;

  // Verify the ID token if it exists
  if (tokens.idToken) {
    try {
      // const firebaseAuth = getAuth(firebaseApp);
      user = convertToUserCtx(await admin.auth().verifyIdToken(tokens.idToken));
    } catch (error) {
      console.error("Error verifying ID token:", error);
    }
  }
  // console.log("user", user);

  return {
    db,
    ...opts,
    user,
    // req,
    // res,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    console.log("ctx.user", ctx.user);
    return next({
      ctx: {
        // infers the `session` as non-nullable
        user: ctx.user,
      },
    });
  });
