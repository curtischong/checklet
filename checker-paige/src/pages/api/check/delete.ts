import { CheckerBlueprint } from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import {
    disableCheckerIfNoEnabledChecks,
    isUserCheckOwner,
    isUserCheckerOwner,
} from "pages/api/common";
import {
    connectToRedis,
    requestMiddleware,
    return204Status,
    sendBadRequest,
} from "pages/api/commonNetworking";
import { createClient } from "redis";

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
    const checkerId = req.body.checkerId;

    if (!(await isUserCheckOwner(redisClient, res, userId, checkId))) {
        return;
    }
    if (!(await isUserCheckerOwner(redisClient, res, userId, checkerId))) {
        return;
    }

    const checkerKey = `checkers/${checkerId}`;
    const rawCheckerBlueprint = await redisClient.get(checkerKey);
    if (rawCheckerBlueprint === null) {
        sendBadRequest(res, "Checker does not exist");
        return;
    }
    const checkerBlueprint: CheckerBlueprint = JSON.parse(rawCheckerBlueprint);
    if (!(checkId in checkerBlueprint.checkStatuses)) {
        sendBadRequest(
            res,
            `CheckId=${checkId} does not exist in checkStatuses=${JSON.stringify(
                checkerBlueprint.checkStatuses,
            )}`,
        );
        return;
    }

    delete checkerBlueprint.checkStatuses[checkId];

    await disableCheckerIfNoEnabledChecks(
        redisClient,
        checkerBlueprint,
        checkerId,
    );

    // we are done validating. now write
    await redisClient.set(checkerKey, JSON.stringify(checkerBlueprint));

    // https://redis.io/commands/srem/ This should be O(1)
    await redisClient.sRem(`users/${userId}/checkIds`, checkId);
    await redisClient.del(`checks/${checkId}`);

    return204Status(res);
}
