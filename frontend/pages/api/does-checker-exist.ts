import { NextApiRequest, NextApiResponse } from "next";
import { isUnauthenticatedRequestValid } from "pages/api/common";
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

    const doesCheckerExist = await redisClient.sIsMember(
        "publicCheckerIds",
        checkerId,
    );

    res.status(200).json({
        doesCheckerExist,
    });
    return;
}
