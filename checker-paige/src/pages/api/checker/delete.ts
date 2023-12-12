import { CheckerBlueprint } from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import { isUserCheckerOwner } from "pages/api/common";
import {
    connectToRedis,
    requestMiddleware,
    return204Status,
    sendBadRequest,
} from "pages/api/commonNetworking";

export default async function deleteChecker(
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

    // delete all the checks
    const checkerKey = `checkers/${checkerId}`;
    const rawCheckerBlueprint = await redisClient.get(checkerKey);
    if (rawCheckerBlueprint === null) {
        sendBadRequest(res, `Checker ${checkerId} does not exist`);
        return;
    }
    const checkerBlueprint: CheckerBlueprint = JSON.parse(rawCheckerBlueprint);
    const checkIds = checkerBlueprint.checkStatuses
        ? Object.keys(checkerBlueprint.checkStatuses)
        : [];
    const checkKeys = checkIds.map((checkId) => `checks/${checkId}`);
    if (checkIds.length > 0) {
        await redisClient.del(checkKeys);
        await redisClient.sRem(`users/${userId}/checkIds`, checkIds);
    }

    // now delete the checker
    await redisClient.sRem(`users/${userId}/checkerIds`, checkerId);
    // https://redis.io/commands/srem/ This should be O(1)

    // it doesn't matter if it's not public. we'll just delete it anyway
    await redisClient.sRem("publicCheckerIds", req.body.checkerId);

    await redisClient.del(checkerKey);
    return204Status(res);
}
