import { CheckerId } from "@api/checker";
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
