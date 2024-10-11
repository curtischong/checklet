import { createWSClient } from "@trpc/client";

// create persistent WebSocket connection
export const wsClient = createWSClient({
  url: `ws://localhost:3001`,
});
