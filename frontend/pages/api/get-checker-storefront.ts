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
        // do not send bad request since we already know it errored out. we don't want to show the error toast
        res.status(200).json({
            checkerStorefront: undefined,
        });
        return;
    }
    const checkerBlueprint = JSON.parse(rawCheckerBlueprint);
    if (!checkerBlueprint.isPublic && checkerBlueprint.creatorId !== uid) {
        // do not send bad request since we already know it errored out. we don't want to show the error toast
        res.status(200).json({
            checkerStorefront: undefined,
        });
        return;
    }

    const checkerStorefront =
        checkerBlueprintToCheckerStorefront(checkerBlueprint);

    res.status(200).json({
        checkerStorefront,
    });
    return;
}
