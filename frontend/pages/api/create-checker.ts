import { CheckerId } from "@api/checker";
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
    const checkerBlueprint: CheckerBlueprint = req.body.blueprint;
    const checkerId = req.body.checkerId;

    const validationErr = isBlueprintValid(checkerBlueprint, checkerId);
    if (validationErr !== "") {
        sendBadRequest(res, validationErr);
        return;
    }

    await redisClient.set(
        `checkers/${checkerId}`,
        JSON.stringify(checkerBlueprint), // TODO: compress this
    );

    // instead of json.stringifying an array, we use a set
    // https://stackoverflow.com/questions/16844188/saving-and-retrieving-array-of-strings-in-redis
    const checkerIdsKey = `users/${userId}/checkerIds`;
    const checkerIds = await redisClient.sMembers(checkerIdsKey);
    if (checkerIds.includes(checkerId)) {
        sendBadRequest(res, "CheckerId already exists");
        return;
    }
    if (checkerIds.length >= 7) {
        sendBadRequest(res, "You can only have 7 checkers");
        return;
    }
    await redisClient.sAdd(checkerIdsKey, checkerId);

    res.status(200).json({ status: "success" });
}

const isBlueprintValid = (
    blueprint: CheckerBlueprint,
    checkerId: string,
): string => {
    if (blueprint.name === "") {
        return "Checker description cannot be empty";
    } else if (blueprint.desc === "") {
        return "Checker description cannot be empty";
    } else if (blueprint.checkBlueprints.length === 0) {
        return "Checker must have at least one check";
    } else if (checkerId.length !== 64) {
        return `Checker id=${checkerId} must be 64 characters long`;
    }
    // TODO: validate checkBlueprints

    return "";
};