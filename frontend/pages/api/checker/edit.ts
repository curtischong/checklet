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

    // verify that the checkerIds in the checkStatuses exist
    for (const checkId of Object.keys(checkerBlueprint.checkStatuses)) {
        if (!(await redisClient.exists(`checks/${checkId}`))) {
            sendBadRequest(
                res,
                `Check with id ${checkId} does not exist. Do not set it in checkStatuses`,
            );
            return;
        }
    }

    if (checkerBlueprint.isPublic) {
        // validate that it's legit before we make it public
        const validationErr = await validateChecker(
            redisClient,
            userId,
            checkerBlueprint,
        );

        // do not send an error. just save it, but don't add it to the public list
        if (validationErr !== "") {
            checkerBlueprint.isPublic = false;
            await redisClient.sRem("publicCheckerIds", checkerId);
        } else {
            // https://stackoverflow.com/questions/16844188/saving-and-retrieving-array-of-strings-in-redis
            await redisClient.sAdd("publicCheckerIds", checkerId);
        }
    } else {
        await redisClient.sRem("publicCheckerIds", checkerId);
    }

    checkerBlueprint.objInfo.creatorId = userId; // override just for security purposes

    await redisClient.set(
        `checkers/${checkerId}`,
        JSON.stringify(checkerBlueprint), // TODO: compress this
    );

    return204Status(res);
}
