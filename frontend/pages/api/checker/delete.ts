import { NextApiRequest, NextApiResponse } from "next";
import { isUserCheckerOwner } from "pages/api/common";
import {
    requestMiddleware,
    return204Status,
    sendBadRequest,
} from "pages/api/commonNetworking";
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

    // delete all the checks
    const checkerKey = `checkers/${checkerId}`;
    const rawCheckerBlueprint = await redisClient.get(checkerKey);
    if (rawCheckerBlueprint === null) {
        sendBadRequest(res, `Checker ${checkerId} does not exist`);
        return;
    }
    const checkerBlueprint = JSON.parse(rawCheckerBlueprint);
    for (const checkId of Object.keys(checkerBlueprint.statuses)) {
        await redisClient.del(`checks/${checkId}`);
        await redisClient.sRem(`users/${userId}/checkIds`, checkId);
    }

    // now delete the checker
    await redisClient.sRem(`users/${userId}/checkerIds`, checkerId);
    // https://redis.io/commands/srem/ This should be O(1)

    // it doesn't matter if it's not public. we'll just delete it anyway
    await redisClient.sRem("publicCheckerIds", req.body.checkerId);

    await redisClient.del(checkerKey);
    return204Status(res);
}
