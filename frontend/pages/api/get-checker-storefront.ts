import { NextApiRequest, NextApiResponse } from "next";
import { isUnauthenticatedRequestValid } from "pages/api/common";
import { checkerBlueprintToCheckerStorefront } from "pages/api/public-checks";
import { createClient } from "redis";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    if (!isUnauthenticatedRequestValid(req, res)) {
        return;
    }

    // https://redis.io/docs/connect/clients/nodejs/
    const redisClient = createClient();
    await redisClient.connect();

    const checkerId = req.body.checkerId;

    const checkerBlueprint = await redisClient.get(`checkers/${checkerId}`);
    const checkerStorefront = checkerBlueprint
        ? checkerBlueprintToCheckerStorefront(JSON.parse(checkerBlueprint))
        : null;

    res.status(200).json({
        checkerStorefront,
    });
    return;
}
