import { NextApiRequest, NextApiResponse } from "next";
import {
    isUserCheckerOwner,
    requestMiddleware,
    return204Status,
    sendBadRequest,
} from "pages/api/common";
import { createClient } from "redis";

export default async function setCheckerIsPublic(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    const userId = await requestMiddleware(req, res);
    if (userId === null) {
        return;
    }

    const checkerId = req.body.checkerId;
    const redisClient = createClient();
    await redisClient.connect();
    if (!(await isUserCheckerOwner(redisClient, res, userId, checkerId))) {
        return;
    }
    const isPublic = req.body.isPublic;
    const rawCheckerBlueprint = await redisClient.get(`checkers/${checkerId}`);
    if (rawCheckerBlueprint === null) {
        sendBadRequest(res, "Checker does not exist");
        return;
    }
    const checkerBlueprint = JSON.parse(rawCheckerBlueprint);
    checkerBlueprint.isPublic = isPublic;
    await redisClient.set(
        `checkers/${checkerId}`,
        JSON.stringify(checkerBlueprint),
    );
    return204Status(res);
}
