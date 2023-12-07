import {
    CheckBlueprint,
    CheckType,
} from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import {
    isUserCheckOwner,
    validateCheckType,
    validateObjInfo,
} from "pages/api/common";
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

    const checkBlueprint: CheckBlueprint = req.body.checkBlueprint;
    const checkId = checkBlueprint.objInfo.id;

    if (!(await isUserCheckOwner(redisClient, res, userId, checkId))) {
        return;
    }

    if (checkBlueprint.isEnabled) {
        // validate that it's legit before we make it enabled
        const validationErr = validateCheckBlueprint(checkBlueprint);
        if (validationErr !== "") {
            sendBadRequest(res, validationErr);
            return;
        }
    }

    checkBlueprint.objInfo.creatorId = userId; // override just for security purposes

    const positiveExamples = checkBlueprint.positiveExamples;
    for (const example of positiveExamples) {
        if (checkBlueprint.checkType !== CheckType.rephrase) {
            example.editedText = ""; // clear, so users can't pass in bad data
        }
    }

    await redisClient.set(
        `checks/${checkId}`,
        JSON.stringify(checkBlueprint), // TODO: compress this
    );

    return204Status(res);
}
