import { clientConfig, serverConfig } from "@/server/firebase/config";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";

export interface UserCtx {
  id: string;
  email: string;
  email_verified: boolean;
}

export const getUserCtx = async (): Promise<UserCtx | undefined> => {
  const tokens = await getTokens(cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });
  const userToken = tokens?.decodedToken;
  console.log("userToken", userToken);
  if (!userToken) {
    return undefined;
  }
  const userCtx: UserCtx = {
    id: userToken.uid,
    email: userToken.email!,
    email_verified: userToken.email_verified!,
  };
  return userCtx;
};
