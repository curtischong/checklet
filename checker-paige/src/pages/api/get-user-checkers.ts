import { RedisClient, connectToRedis, requestMiddleware } from "@/pages/api/commonNetworking";
import { CheckerId } from "@api/checker";
import { CheckerBlueprint } from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    const userId = await requestMiddleware(req, res);
    if (userId === null) {
        return;
    }

    const redisClient = await connectToRedis();
    const checkerIds = await redisClient.sMembers(`users/${userId}/checkerIds`);
    const checkerBlueprints = await getCheckerBlueprints(
        redisClient,
        checkerIds,
    );

    res.status(200).json({
        checkerBlueprints,
    });
}

export const getCheckerBlueprints = async (
    redisClient: RedisClient,
    checkerIds: CheckerId[],
): Promise<CheckerBlueprint[]> => {
    const checkerBlueprintPromises = checkerIds.map((checkerId) =>
        redisClient.get(`checkers/${checkerId}`),
    );
    const resolvedCheckerBlueprints = await Promise.all(
        checkerBlueprintPromises,
    );

    const checkerBlueprints: CheckerBlueprint[] = [];
    for (let i = 0; i < resolvedCheckerBlueprints.length; i++) {
        const checkerBlueprint = resolvedCheckerBlueprints[i];
        if (checkerBlueprint) {
            checkerBlueprints.push({
                ...JSON.parse(checkerBlueprint),
                id: checkerIds[i],
            });
        } else {
            console.error(
                "couldn't find checkerBlueprint for checkerId: ",
                checkerIds[i],
            );
        }
    }
    return checkerBlueprints;
};
