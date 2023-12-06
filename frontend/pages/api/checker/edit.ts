import { CheckerBlueprint } from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import { isUserCheckerOwner, validateChecker } from "pages/api/common";
import {
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
    // https://redis.io/docs/connect/clients/nodejs/
    const redisClient = createClient();
    await redisClient.connect();

    const checkerBlueprint: CheckerBlueprint = req.body.checkerBlueprint;
    const checkerId = checkerBlueprint.objInfo.id;

    if (!(await isUserCheckerOwner(redisClient, res, userId, checkerId))) {
        return;
    }

    if (checkerBlueprint.isPublic) {
        // validate that it's legit before we make it public
        const validationErr = await validateChecker(
            redisClient,
            userId,
            checkerBlueprint,
        );
        if (validationErr !== "") {
            sendBadRequest(res, validationErr);
            return;
        }

        // https://stackoverflow.com/questions/16844188/saving-and-retrieving-array-of-strings-in-redis
        await redisClient.sAdd("publicCheckerIds", checkerId);
    }

    checkerBlueprint.objInfo.creatorId = userId; // override just for security purposes

    await redisClient.set(
        `checkers/${checkerId}`,
        JSON.stringify(checkerBlueprint), // TODO: compress this
    );

    return204Status(res);
}
