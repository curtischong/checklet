import {
    CheckBlueprint,
    CheckType,
} from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import { isUserCheckOwner } from "pages/api/common";
import { requestMiddleware, return204Status } from "pages/api/commonNetworking";
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
