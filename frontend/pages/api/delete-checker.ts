import { CheckerId } from "@api/checker";
import { NextApiRequest, NextApiResponse } from "next";
import { requestMiddleware, sendBadRequest } from "pages/api/common";
import { createClient } from "redis";

export default async function deleteChecker(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    const userId = await requestMiddleware(req, res);
    if (userId === null) {
        return;
    }

    const redisClient = createClient();
    await redisClient.connect();
    if (
        !(await redisClient.sIsMember(
            `users/${userId}/checkerIds`,
            req.body.checkerId,
        ))
    ) {
        sendBadRequest(
            res,
            "You did not create this checker. You cannot delete it",
        );
        return;
    }
    await redisClient.sRem(`users/${userId}/checkerIds`, req.body.checkerId);

    await redisClient.del(`checkers/${req.body.checkerId}`);
    res.status(204);
}
