/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { appRouter } from "@/server/api/root";
import { createWSClient } from "@trpc/client";
import {
  applyWSSHandler,
  type CreateWSSContextFnOptions,
} from "@trpc/server/adapters/ws";
import ws from "ws";

const wss = new ws.Server({
  port: 3001,
});

export const createContext = async (opts: CreateWSSContextFnOptions) => {
  const token = opts.info.connectionParams?.token;

  const token: string | undefined;

  // [... authenticate]

  return {};
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext,
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

// create persistent WebSocket connection
export const wsClient = createWSClient({
  url: `ws://localhost:3001`,
});
