import { serverConfig } from "@/firebase/config";
import { convertToUserCtx } from "@/server/api/trpc";
import { db } from "@/server/db";
import { type CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { parse } from "cookie";
import admin from "firebase-admin";
import { getCookiesTokens } from "next-firebase-auth-edge/lib/next/tokens";

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

export const createContext = async (opts: CreateWSSContextFnOptions) => {
  const headers = getFetchAPIHeaders(opts);
  // const cookies = headers.cookie;
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
      console.error("Error verifying ID token:", error);
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
