import { NextApiRequest, NextApiResponse } from "next";
import { isUserCheckerOwner, requestMiddleware } from "pages/api/common";
import { createClient } from "redis";

export default async function deleteChecker(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
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
    res.status(204);
}
