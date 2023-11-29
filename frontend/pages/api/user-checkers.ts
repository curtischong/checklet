import { CheckerId } from "@api/checker";
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
    const rawCheckerIds = await redisClient.get(`users/${userId}/checkerIds`);
    const checkerIds: CheckerId[] = rawCheckerIds
        ? JSON.parse(rawCheckerIds)
        : [];
    const checkerBlueprintPromises = checkerIds.map((checkerId) =>
        redisClient.get(`checkers/${checkerId}`),
    );
    const resolvedCheckerBlueprints = await Promise.all(
        checkerBlueprintPromises,
    );

    const checkerBlueprints = [];
    for (let i = 0; i < resolvedCheckerBlueprints.length; i++) {
        const checkerBlueprint = resolvedCheckerBlueprints[i];
        if (checkerBlueprint) {
            checkerBlueprints.push(JSON.parse(checkerBlueprint));
        } else {
            console.error(
                "couldn't find checkerBlueprint for checkerId: ",
                checkerIds[i],
            );
        }
    }

    res.status(200).json({
        checkerBlueprints,
    });
}
