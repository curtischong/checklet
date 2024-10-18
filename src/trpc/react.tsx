"use client";

import {
  createTRPCClient,
  createWSClient,
  httpBatchLink,
  wsLink,
  type TRPCLink,
} from "@trpc/client";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import SuperJSON from "superjson";

import { type AppRouter } from "@/server/api/root";
import { type TRPCError } from "@trpc/server";
import { toast } from "react-toastify";

export const getTrpcClient = () => {
  return createTRPCClient<AppRouter>({
    links: [
      // loggerLink({
      //   enabled: (op) =>
      //     process.env.NODE_ENV === "development" ||
      //     (op.direction === "down" && op.result instanceof Error),
      // }),
      getEndingLink(),
      // httpBatchLink({
      //   transformer: SuperJSON,
      //   url: getBaseUrl() + "/api/trpc",
      //   headers: () => {
      //     const headers = new Headers();
      //     headers.set("x-trpc-source", "nextjs-react");
      //     return headers;
      //   },
      // }),
      // unstable_httpBatchStreamLink({
      //   transformer: SuperJSON,
      //   url: getBaseUrl() + "/api/trpc",
      //   headers: () => {
      //     const headers = new Headers();
      //     headers.set("x-trpc-source", "nextjs-react");
      //     return headers;
      //   },
      // }),
    ],
  });
};
export type GetTrpcClientType = ReturnType<typeof getTrpcClient>;

function getEndingLink(): TRPCLink<AppRouter> {
  if (typeof window === "undefined") {
    return httpBatchLink({
      transformer: SuperJSON,
      url: process.env.NEXT_PUBLIC_URL + "/api/trpc",
      headers: () => {
        const headers = new Headers();
        headers.set("x-trpc-source", "nextjs-react");
        return headers;
      },
    });
  }

  const socket_url = `${process.env.NEXT_PUBLIC_SOCKET_HOST}:${process.env.NEXT_PUBLIC_SOCKET_SERVER_EXPOSED_PORT}`;
  console.log(`created websocket client for: ${socket_url}`);
  const client = createWSClient({
    url: socket_url,
  });
  return wsLink({
    client,
    /**
     * @see https://trpc.io/docs/v11/data-transformers
     */
    transformer: SuperJSON,
  });
}

export function handleErr<T>(
  promise: Promise<T>,
  onSuccess?: (res: T) => void,
  onErr?: (err: TRPCError) => void,
) {
  promise.then(onSuccess).catch((err: TRPCError) => {
    toast.error(err.message);
    console.error("An error occurred:", err);
    onErr?.(err);
  });
}

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
