import dotenvLoad from "./load_dotenv";
console.log("is env loaded?", dotenvLoad);

import { appRouter } from "@/server/api/root";
import { createTRPCStreamingContext } from "@/server/sockets/context";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { WebSocketServer } from "ws";

const port = parseInt(process.env.NEXT_PUBLIC_SOCKET_SERVER_RUNNING_ON_PORT!);
const wss = new WebSocketServer({
  port,
});

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: createTRPCStreamingContext,
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
console.log(`✅ WebSocket Server listening on ws://localhost:${port}`);
process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
