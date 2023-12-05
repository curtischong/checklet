import { NextApiRequest, NextApiResponse } from "next";
import {
    isUserCheckerOwner,
    requestMiddleware,
    return204Status,
} from "pages/api/common";
import { createClient } from "redis";

export default async function deleteChecker(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<undefined> {
    const userId = await requestMiddleware(req, res);
    if (userId === null) {
        return;
    }

    const redisClient = createClient();
    await redisClient.connect();
    const checkerId = req.body.checkerId;
    if (!(await isUserCheckerOwner(redisClient, res, userId, checkerId))) {
        return;
    }
    await redisClient.sRem(`users/${userId}/checkerIds`, checkerId);
    // https://redis.io/commands/srem/ This should be O(1)
    await redisClient.sRem("publicCheckerIds", req.body.checkerId);

    await redisClient.del(`checkers/${req.body.checkerId}`);
    return204Status(res);
}
