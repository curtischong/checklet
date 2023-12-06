import { CheckBlueprint } from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import { isUserCheckOwner } from "pages/api/common";
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
