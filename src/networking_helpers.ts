// problem: after authenticating the user in the middleware, we need to pass the user's information to the route
// However, this info is a json object, so we need to serialize it and then parse it on the other side
// solution: we have custom serialize and deserialize functions
// from https://stackoverflow.com/questions/9779860/using-json-string-in-the-http-header

import { Config } from "@da_config";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "@/shared/status-codes";
import { Claims } from "@auth0/nextjs-auth0";
import { DefaultAzureCredential } from "@azure/identity";
import { NextRequest, NextResponse } from "next/server";
import { UserCtx } from "@/shared/user-ctx";

export const authHeaderName = "da-user-ctx";
export const requestPathHeaderName = "x-request-path";

// you can call the auth0 api to get MORE user info
async function getUserInfo(accessToken: string): Promise<any> {
    // https://auth0.com/docs/api/authentication#user-profile
    try {
        const response = await fetch(
            // TODO: use env variables to get the right domain instead of hardcoding it
            "https://dev-zfo6dva6vhkhpbxw.us.auth0.com/userinfo",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userInfo = await response.json();
        return userInfo;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
}

export const getUserCtxFromUserClaims = (user: Claims): UserCtx => {
    // console.log("getUserCtxFromUserClaims:", user);
    return {
        id: user.sub,
        givenName: user.given_name,
        familyName: user.family_name,
        nickname: user.nickname,
        name: user.name,
        picture: user.picture,
        email: user.email,
        emailVerified: user.email_verified,
    };
};

// we can actually make this more general. so we can store arbitrary info in headers, not just userCtx (since we're encoding json data)
// however, for now, this is fine
// PERF: implement compression, or even a custom schema (e.g. the ith byte is the userId). so the header is smaller
export const serializeAuthHeader = (
    res: NextResponse,
    userCtx: UserCtx,
): void => {
    const myJsonStr = JSON.stringify(userCtx);
    // the user's email is in the json object. so it may not be in ascii format? Eitherway, it's safer to convert it to base64 first
    const headerFriendlyStr = Buffer.from(myJsonStr, "utf8").toString("base64");
    res.headers.set(authHeaderName, headerFriendlyStr);
};

export const parseAuthHeader = (req: NextRequest): UserCtx => {
    const myBase64Str = req.headers.get(authHeaderName);
    if (!myBase64Str) {
        throw Error(
            "No userCtx found in request. this shoudn't happen since the middleware should've authenticated the user",
        );
    }
    const myJsonStr = Buffer.from(myBase64Str, "base64").toString("utf8");
    return JSON.parse(myJsonStr);
};

// This function is a backup in case we cannot use the middleware to write the authHeader and parse it in the api route.
// export const getUserCtxUsingAuth0 = async (
//     req: NextRequest,
// ): Promise<UserCtx> => {
//     const res = new NextResponse();
//     const session = await getSession(req, res);
//     const user = session!.user;
//     return getUserCtxFromUserClaims(user);
// };

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

export const getClientCredential = (config: Config): DefaultAzureCredential => {
    // const cred_config = config.azure.scheduler.client_credentials;
    // const clientId = cred_config.client_id;
    // const tenantId = cred_config.tenant_id;
    // const secret = cred_config.secret;
    // return new ClientSecretCredential(tenantId, clientId, secret);
    return new DefaultAzureCredential();
};
