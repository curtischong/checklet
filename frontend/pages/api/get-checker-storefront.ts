import { NextApiRequest, NextApiResponse } from "next";
import {
    checkerBlueprintToCheckerStorefront,
    isUnauthenticatedRequestValid,
    sendBadRequest,
    tryGetUserId,
} from "pages/api/common";
import { createClient } from "redis";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    if (!isUnauthenticatedRequestValid(req, res)) {
        return;
    }
    let uid: string | null = null;
    if (req.body.idToken !== undefined) {
        uid = await tryGetUserId(req, res);
    }

    // https://redis.io/docs/connect/clients/nodejs/
    const redisClient = createClient();
    await redisClient.connect();

    const checkerId = req.body.checkerId;

    const rawCheckerBlueprint = await redisClient.get(`checkers/${checkerId}`);
    if (rawCheckerBlueprint === null) {
        sendBadRequest(res, "Checker does not exist");
        return;
    }
    const checkerBlueprint = JSON.parse(rawCheckerBlueprint);
    if (!checkerBlueprint.isPublic && checkerBlueprint.creatorId !== uid) {
        // send the same error as if the checker doesn't exist for security reasons
        sendBadRequest(res, "Checker does not exist");
        return;
    }

    const checkerStorefront = checkerBlueprintToCheckerStorefront(
        JSON.parse(checkerBlueprint),
    );

    res.status(200).json({
        checkerStorefront,
    });
    return;
}
