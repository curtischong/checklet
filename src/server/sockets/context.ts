import { serverConfig } from "@/firebase/config";
import { type UserCtx } from "@/firebase/edge_env";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { type CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { parse } from "cookie";
import admin from "firebase-admin";
import { getCookiesTokens } from "next-firebase-auth-edge/lib/next/tokens";

const convertToUserCtx = (user: admin.auth.DecodedIdToken): UserCtx => {
  return {
    id: user.uid,
    email: user.email!,
    email_verified: user.email_verified!,
  };
};

const getFetchAPIHeaders = (opts: CreateWSSContextFnOptions) => {
  const headers = new Headers();
  const incomingHeaders = opts.req.headers;

  for (const [key, value] of Object.entries(incomingHeaders)) {
    if (Array.isArray(value)) {
      headers.append(key, value.join(", "));
    } else if (value !== undefined) {
      headers.append(key, value);
    }
  }
  return headers;
};

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return await createContext(opts);
};

export const createTRPCStreamingContext = async (
  opts: CreateWSSContextFnOptions,
) => {
  const headers = getFetchAPIHeaders(opts);
  return await createContext({ headers });
};

const createContext = async (opts: { headers: Headers }) => {
  const headers = opts.headers;
  const cookies = headers.get("cookie")!;
  if (!cookies) {
    // there are no cookies. incognito mode? or maybe they're not logged in.
    // it's fine. user will just be null
    return {
      db,
      ...opts,
      user: null,
      headers,
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
      headers,
    };
  }

  let user = null;

  // Verify the ID token if it exists
  if (tokens.idToken) {
    try {
      // const firebaseAuth = getAuth(firebaseApp);
      user = convertToUserCtx(await admin.auth().verifyIdToken(tokens.idToken));
    } catch (error) {
      if (String(error).startsWith("Firebase ID token has expired.")) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "Your auth token has expired. Refresh and you should be good to go!",
        });
      }
      // console.error("Error verifying ID token:", error);
    }
  }
  // console.log("user", user);

  return {
    db,
    ...opts,
    user,
    headers,
  };
};
export type Context = Awaited<ReturnType<typeof createContext>>;
