import { CheckerId } from "@api/checker";
import { CheckerBlueprint } from "@components/create-checker/CheckerCreator";
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "redis";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    if (req.method !== "POST") {
        // Handle any non-POST requests
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    // https://redis.io/docs/connect/clients/nodejs/
    // const userId = req.cookies.userId;
    const userId = "1234"; // TODO: pass the right userid
    const redisClient = createClient();
    await redisClient.connect();
    const checkerBlueprint: CheckerBlueprint = req.body.blueprint;
    const checkerId = req.body.checkerId;
    // console.log(
    //     "req.body: ",
    //     req.body,
    //     checkerId,
    //     JSON.stringify(checkerBlueprint),
    // );
    await redisClient.set(
        `checkers/${checkerId}`,
        JSON.stringify(checkerBlueprint), // TODO: compress this
    );

    const checkerIdsKey = `users/${userId}/checkerIds`;
    // console.log("1");
    const rawCheckerIds = await redisClient.get(checkerIdsKey);
    const checkerIds: CheckerId[] = rawCheckerIds
        ? JSON.parse(rawCheckerIds)
        : [];
    // console.log("2");
    if (checkerIds.includes(checkerId)) {
        console.error("checkerId already exists");
        res.status(400);
        return;
    }
    // console.log("3");
    checkerIds.push(checkerId);
    await redisClient.set(checkerIdsKey, JSON.stringify(checkerIds));

    res.status(200).json({ status: "success" });
}
