// problem: after authenticating the user in the middleware, we need to pass the user's information to the route
// However, this info is a json object, so we need to serialize it and then parse it on the other side
// solution: we have custom serialize and deserialize functions
// from https://stackoverflow.com/questions/9779860/using-json-string-in-the-http-header

import { type UserCtx } from "@/firebase/edge_env";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "@/utils/status_codes";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const requestPathHeaderName = "x-request-path";
const headerName = "checklet-user-ctx";

// we can actually make this more general. so we can store arbitrary info in headers, not just userCtx (since we're encoding json data)
// however, for now, this is fine
// PERF: implement compression, or even a custom schema (e.g. the ith byte is the userId). so the header is smaller
export const serializeAuthHeader = (
  headers: Headers,
  userCtx: UserCtx,
): void => {
  const myJsonStr = JSON.stringify(userCtx);
  // the user's email is in the json object. so it may not be in ascii format? Eitherway, it's safer to convert it to base64 first
  const headerFriendlyStr = Buffer.from(myJsonStr, "utf8").toString("base64");
  headers.set(headerName, headerFriendlyStr);
};

// to be used in server-side components
export const parseAuthHeader = (): UserCtx | undefined => {
  const myBase64Str = headers().get(headerName);
  if (!myBase64Str) {
    // console.warn(
    //   "No userCtx found in request. this shoudn't happen since the middleware should've authenticated the user",
    // );
    return undefined;
  }
  const myJsonStr = Buffer.from(myBase64Str, "base64").toString("utf8");
  return JSON.parse(myJsonStr) as UserCtx;
};

export const sendBadRequest = (message: string): NextResponse => {
  console.error(message);
  return NextResponse.json(
    {
      message,
    },
    {
      status: BAD_REQUEST,
    },
  );
};

export const sendServerError = (message: string): NextResponse => {
  console.error(message);
  return NextResponse.json(
    {
      message,
    },
    {
      status: INTERNAL_SERVER_ERROR,
    },
  );
};
