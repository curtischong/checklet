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
    // Server ping message interval in milliseconds
    pingMs: 30000, // Send a ping every 30 seconds
    // Connection is terminated if a pong message is not received within this many milliseconds
    pongWaitMs: 60000, // Wait up to 1 minute for a pong response
  },
});

wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);

  // Set a timeout to close the connection after 12 hours
  const twelveHoursInMs = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
  const maxConnectionDuration = setTimeout(() => {
    ws.close(1000, "Connection closed after maximum duration of 12 hours");
    console.log("🔒 Connection closed after 12 hours");
  }, twelveHoursInMs);

  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
    clearTimeout(maxConnectionDuration); // Clear the timeout when the connection is closed
  });
});

console.log(`✅ WebSocket Server listening on http://localhost:${port}`);

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  handler.broadcastReconnectNotification();
  wss.close();
});
