import { MAX_CHECK_NAME_LEN } from "@/constants";
import { isUserCheckerOwner, validateCheckType } from "@/pages/api/common";
import {
    RedisClient,
    connectToRedis,
    requestMiddleware,
    sendBadRequest,
} from "@/pages/api/commonNetworking";
import { CheckerId } from "@api/checker";
import {
    CheckBlueprint,
    CheckId,
    CheckStatus,
    CheckType,
    CheckerBlueprint,
} from "@components/create-checker/CheckerTypes";
import { createShortId } from "@utils/strings";
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
    if (name.length > MAX_CHECK_NAME_LEN) {
        sendBadRequest(
            res,
            `Check name cannot be longer than ${MAX_CHECK_NAME_LEN} characters`,
        );
        return;
    }

    const validateCheckTypeErr = validateCheckType(checkType);
    if (validateCheckTypeErr !== "") {
        sendBadRequest(res, validateCheckTypeErr);
        return;
    }

    const checkId = createShortId();
    const checkIdKey = `checks/${checkId}`;
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
    const checkStatus: CheckStatus = {
        isEnabled: false,
    };
    checkerBlueprint.checkStatuses[checkId] = checkStatus;
    await redisClient.set(
        `checkers/${checkerId}`,
        JSON.stringify(checkerBlueprint),
    );
    return true;
};
