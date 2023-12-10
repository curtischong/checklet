import {
    CheckBlueprint,
    CheckerBlueprint,
} from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import { getCheckBlueprints, isUserCheckerOwner } from "pages/api/common";
import {
    connectToRedis,
    requestMiddleware,
    sendBadRequest,
} from "pages/api/commonNetworking";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    const userId = await requestMiddleware(req, res);
    if (userId === null) {
        return;
    }
    const redisClient = await connectToRedis();
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
    const checkBlueprints: CheckBlueprint[] = await getCheckBlueprints(
        redisClient,
        checkerBlueprint,
        false,
    );

    res.status(200).json({
        checkerBlueprint,
        checkBlueprints,
    });
}
