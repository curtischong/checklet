import { CheckBlueprint } from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import { isUserCheckOwner } from "pages/api/common";
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
    const checkId = req.body.checkId;

    if (!(await isUserCheckOwner(redisClient, res, userId, checkId))) {
        return;
    }

    const rawCheckBlueprint = await redisClient.get(`checks/${checkId}`);
    if (!rawCheckBlueprint) {
        sendBadRequest(res, "CheckBlueprint not found");
        return;
    }

    const checkBlueprint: CheckBlueprint = JSON.parse(rawCheckBlueprint);

    res.status(200).json({
        checkBlueprint,
    });
}
