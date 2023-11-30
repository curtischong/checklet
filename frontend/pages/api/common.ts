import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps } from "firebase-admin/app";
import { firebaseConfig } from "@utils/ClientContext";

// returns the uid for the authenticated user.
// If the user is not authenticated, or their headers are weird, it returns null
export const requestMiddleware = async (
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<string | null> => {
    if (req.method !== "POST") {
        // Handle any non-POST requests
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(
            `Method ${req.method} Not Allowed. Only POST is allowed`,
        );
        return null;
    }
    // if we already initialized app, don't do it more than once:
    // https://github.com/firebase/firebase-admin-node/issues/2111
    const alreadyCreatedAps = getApps();
    const app =
        alreadyCreatedAps.length === 0
            ? initializeApp(firebaseConfig)
            : alreadyCreatedAps[0];

    let decodedToken;
    try {
        decodedToken = await getAuth(app).verifyIdToken(req.body.idToken);
    } catch (err) {
        console.error(err);
        res.status(401).end("Unauthorized");
        return null;
    }
    return decodedToken.uid;
};

export const sendBadRequest = (res: NextApiResponse, msg: string): void => {
    console.error(msg);
    res.status(400).send({ errorMsg: msg });
    res.end();
};
