import { CheckerBlueprint } from "@components/create-checker/CheckerTypes";
import { createUniqueId } from "@utils/strings";
import { NextApiRequest, NextApiResponse } from "next";
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

    // instead of json.stringifying an array, we use a set
    // https://stackoverflow.com/questions/16844188/saving-and-retrieving-array-of-strings-in-redis
    const userCheckerIdsKey = `users/${userId}/checkerIds`;
    const checkerIds = await redisClient.sMembers(userCheckerIdsKey);
    if (checkerIds.length > 7) {
        sendBadRequest(
            res,
            "You can only have 7 checkers. Contact Curtis if you need more!",
        );
        return;
    }

    const checkerId = createUniqueId();
    const checkerIdKey = `checkers/${checkerId}`;
    if (await redisClient.exists(checkerIdKey)) {
        sendBadRequest(
            res,
            "generated the same checker ID. Is the ID generator collision resistant?",
        );
        return;
    }

    const checkerBlueprint: CheckerBlueprint = {
        objInfo: {
            id: checkerId,
            name: "",
            desc: "",
            creatorId: userId,
        },
        checkStatuses: {},
        isPublic: false,
    };

    await redisClient.set(
        checkerIdKey,
        JSON.stringify(checkerBlueprint), // TODO: compress this
    );

    await redisClient.sAdd(userCheckerIdsKey, checkerId);

    res.status(200).json({ checkerId });
}