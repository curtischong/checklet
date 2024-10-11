import { appRouter } from "@/server/api/root";
import { db } from "@/server/db";
import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";

const wss = new ws.Server({
  port: 3001,
});

export const createContext = (opts: CreateWSSContextFnOptions) => {
  const token = opts.info.connectionParams?.token;
  console.log("token", token);

  return {
    db,
    ...opts,
    user: null,
  };

  // // Retrieve tokens using next-firebase-auth-edge
  // let tokens;
  // try {
  //   tokens = await getCookiesTokens(parse(cookies), {
  //     // apiKey: clientConfig.apiKey,
  //     cookieName: serverConfig.cookieName,
  //     cookieSignatureKeys: serverConfig.cookieSignatureKeys,
  //     // cookieSerializeOptions: serverConfig.cookieSerializeOptions,
  //     // serviceAccount: serverConfig.serviceAccount,
  //   });
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // } catch (_err) {
  //   // console.error("Error getting cookies tokens", _err);
  //   // there is a high chance this is a InvalidTokenError: MISSING_CREDENTIALS: Missing credentials error
  //   // basically, the user is not logged in. this is fine. we can just return null

  //   return {
  //     db,
  //     ...opts,
  //     user: null,
  //   };
  // }

  // let user = null;

  // // Verify the ID token if it exists
  // if (tokens.idToken) {
  //   try {
  //     // const firebaseAuth = getAuth(firebaseApp);
  //     user = convertToUserCtx(await admin.auth().verifyIdToken(tokens.idToken));
  //   } catch (error) {
  //     console.error("Error verifying ID token:", error);
  //   }
  // }
  // // console.log("user", user);

  // return {
  //   db,
  //   ...opts,
  //   user,
  //   // req,
  //   // res,
  // };
};
export type Context = Awaited<ReturnType<typeof createContext>>;

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: createContext,
  // Enable heartbeat messages to keep connection open (disabled by default)
  keepAlive: {
    enabled: true,
    // server ping message interval in milliseconds
    pingMs: 30000,
    // connection is terminated if pong message is not received in this many milliseconds
    pongWaitMs: 5000,
  },
});
wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});
console.log("✅ WebSocket Server listening on ws://localhost:3001");
process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
