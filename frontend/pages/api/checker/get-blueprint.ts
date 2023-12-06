import { CheckerBlueprint } from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import { isUserCheckerOwner } from "pages/api/common";
import { requestMiddleware, sendBadRequest } from "pages/api/commonNetworking";
import { createClient } from "redis";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    const userId = await requestMiddleware(req, res);
    if (userId === null) {
        return;
    }
    // https://redis.io/docs/connect/clients/nodejs/
    const redisClient = createClient();
    await redisClient.connect();
    const checkerId = req.body.checkerId;

    if (!(await isUserCheckerOwner(redisClient, res, userId, checkerId))) {
        return;
    }

    const rawCheckerBlueprint = await redisClient.get(`checkers/${checkerId}`);
    if (!rawCheckerBlueprint) {
        sendBadRequest(res, "CheckerBlueprint not found");
        return;
    }
    const checkerBlueprint: CheckerBlueprint = JSON.parse(rawCheckerBlueprint);

    res.status(200).json({
        checkerBlueprint,
    });
}
