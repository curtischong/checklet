import { CheckerBlueprint } from "@components/create-checker/CheckerCreator";
import { NextApiRequest, NextApiResponse } from "next";
import { requestMiddleware, sendBadRequest } from "pages/api/common";
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
    const checkerId = req.body.checkerId;

    // TODO: use sadd? cause it'll be more efficient?
    // I just don't know how to handle the initial case when there's an empty set
    // https://stackoverflow.com/questions/16844188/saving-and-retrieving-array-of-strings-in-redis
    const rawCheckerBlueprint = await redisClient.get(`checkers/${checkerId}`);
    if (!rawCheckerBlueprint) {
        sendBadRequest(res, "CheckerBlueprint not found");
        return;
    }
    const checkerBlueprint: CheckerBlueprint = JSON.parse(rawCheckerBlueprint);
    if (checkerBlueprint.creatorId !== userId) {
        sendBadRequest(
            res,
            "You must be the creator of this checker to access it",
        );
        return;
    }

    res.status(200).json({
        checkerBlueprint: {
            ...checkerBlueprint,
            id: checkerId,
        } as CheckerBlueprint,
    });
}
