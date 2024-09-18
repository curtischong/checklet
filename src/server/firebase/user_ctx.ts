import { clientConfig, serverConfig } from "@/server/firebase/config";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";

export const getUserCtx = async () => {
  const tokens = await getTokens(cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });
  return tokens?.decodedToken;
};

export interface UserCtx {
  uid: string;
  email: string;
}
