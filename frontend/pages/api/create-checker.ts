import { CheckerId } from "@api/checker";
import { CheckerBlueprint } from "@components/create-checker/CheckerCreator";
import { NextApiRequest, NextApiResponse } from "next";
import { requestMiddleware } from "pages/api/common";
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
    // const userId = req.cookies.userId;
    // const userId = "1234"; // TODO: pass the right userid
    const redisClient = createClient();
    await redisClient.connect();
    const checkerBlueprint: CheckerBlueprint = req.body.blueprint;
    const checkerId = req.body.checkerId;

    // TODO: use sadd? cause it'll be more efficient?
    // I just don't know how to handle the initial case when there's an empty set
    // https://stackoverflow.com/questions/16844188/saving-and-retrieving-array-of-strings-in-redis
    await redisClient.set(
        `checkers/${checkerId}`,
        JSON.stringify(checkerBlueprint), // TODO: compress this
    );

    const checkerIdsKey = `users/${userId}/checkerIds`;
    const rawCheckerIds = await redisClient.get(checkerIdsKey);
    const checkerIds: CheckerId[] = rawCheckerIds
        ? JSON.parse(rawCheckerIds)
        : [];
    if (checkerIds.includes(checkerId)) {
        console.error("checkerId already exists");
        res.status(400);
        return;
    }
    checkerIds.push(checkerId);
    await redisClient.set(checkerIdsKey, JSON.stringify(checkerIds));

    res.status(200).json({ status: "success" });
}
