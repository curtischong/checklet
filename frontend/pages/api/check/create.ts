import { CheckerId } from "@api/checker";
import {
    CheckBlueprint,
    CheckId,
    CheckType,
    CheckerBlueprint,
    CreateCheckReq,
    validCheckTypes,
} from "@components/create-checker/CheckerTypes";
import { createUniqueId } from "@utils/strings";
import { NextApiRequest, NextApiResponse } from "next";
import {
    isUserCheckerOwner,
    validateObjInfo,
    validateCheckType,
} from "pages/api/common";
import {
    RedisClient,
    requestMiddleware,
    return204Status,
    sendBadRequest,
} from "pages/api/commonNetworking";
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

    // instead of json.stringifying an array, we use a set
    // https://stackoverflow.com/questions/16844188/saving-and-retrieving-array-of-strings-in-redis
    const userCheckIdsKey = `users/${userId}/checkIds`;
    const checkIds = await redisClient.sMembers(userCheckIdsKey);
    if (checkIds.length >= 100) {
        sendBadRequest(
            res,
            "You can only have 100 checks. Contact Curtis if you need more!",
        );
        return;
    }

    const checkerId: CheckerId = req.body.checkerId;
    const name: string = req.body.name;
    const checkType: CheckType = req.body.checkType;

    if (name === "") {
        sendBadRequest(res, "Check name cannot be empty");
        return;
    }

    const validateCheckTypeErr = validateCheckType(checkType);
    if (validateCheckTypeErr !== "") {
        sendBadRequest(res, validateCheckTypeErr);
        return;
    }

    const checkId = createUniqueId();
    const checkIdKey = `checks/${checkerId}`;
    if (await redisClient.exists(checkIdKey)) {
        sendBadRequest(
            res,
            "generated the same check ID. Is the ID generator collision resistant?",
        );
        return;
    }

    if (
        !(await addCheckToChecker(redisClient, res, checkerId, userId, checkId))
    ) {
        return;
    }

    const checkBlueprint: CheckBlueprint = {
        objInfo: {
            name,
            desc: "",
            id: checkId,
            creatorId: userId,
        },
        checkType,
        instruction: "",
        category: "",
        positiveExamples: [],
        isEnabled: true,
    };

    await redisClient.set(
        checkIdKey,
        JSON.stringify(checkBlueprint), // TODO: compress this
    );

    await redisClient.sAdd(userCheckIdsKey, checkId);

    res.status(200).json({ checkId });
}

// returns success
const addCheckToChecker = async (
    redisClient: RedisClient,
    res: NextApiResponse,
    checkerId: CheckerId,
    userId: string,
    checkId: CheckId,
): Promise<boolean> => {
    // make sure you are attaching this check to a checker that you own
    if (!(await isUserCheckerOwner(redisClient, res, userId, checkerId))) {
        return false;
    }

    const rawCheckerBlueprint = await redisClient.get(`checkers/${checkerId}`);
    if (rawCheckerBlueprint === null) {
        sendBadRequest(
            res,
            `Checker with id=${checkerId} does not exist. This means the system is in a bad state. Contact Curtis!`,
        );
        return false;
    }

    const checkerBlueprint: CheckerBlueprint = JSON.parse(rawCheckerBlueprint);
    checkerBlueprint.checkStatuses.push({
        checkId,
        isEnabled: false,
    });
    await redisClient.set(
        `checkers/${checkerId}`,
        JSON.stringify(checkerBlueprint),
    );
    return true;
};
