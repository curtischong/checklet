import { Checker } from "@api/checker";
import { NextApiRequest, NextApiResponse } from "next";
import {
    isUnauthenticatedRequestValid,
    sendBadRequest,
} from "pages/api/common";
import { createClient } from "redis";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    if (!isUnauthenticatedRequestValid(req, res)) {
        return;
    }

    const redisClient = createClient();
    await redisClient.connect();

    const checkerId = req.body.checkerId;
    const doc = req.body.doc;
    const rawCheckerBlueprint = await redisClient.get(`checkers/${checkerId}`);
    if (!rawCheckerBlueprint) {
        sendBadRequest(res, "Checker does not exist");
        return;
    }
    const checkerBlueprint = JSON.parse(rawCheckerBlueprint);
    const checker = new Checker(checkerBlueprint);
    // todo: get data back
    checker.checkDoc(doc);

    res.status(204);
}
