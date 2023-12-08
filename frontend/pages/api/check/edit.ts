import {
    CheckBlueprint,
    CheckType,
} from "@components/create-checker/CheckerTypes";
import { NextApiRequest, NextApiResponse } from "next";
import {
    disableCheckerIfNoEnabledChecks as disableCheckerIfHasNoEnabledChecks,
    isUserCheckOwner,
    isUserCheckerOwner,
    validateCheckBlueprint,
} from "pages/api/common";
import {
    requestMiddleware,
    return204Status,
    sendBadRequest,
} from "pages/api/commonNetworking";
import { createClient } from "redis";
import {
    MAX_CHECK_CATEGORY_LEN,
    MAX_CHECK_DESC_LEN,
    MAX_CHECK_INSTR_LEN,
    MAX_CHECK_NAME_LEN,
    MAX_POSITIVE_EX_EDITED_TEXT_LEN,
    MAX_POSITIVE_EX_ORIGINAL_TEXT_LEN,
} from "src/constants";

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

    const checkerId = req.body.checkerId;
    const checkBlueprint: CheckBlueprint = req.body.checkBlueprint;
    const checkId = checkBlueprint.objInfo.id;

    if (!(await isUserCheckOwner(redisClient, res, userId, checkId))) {
        return;
    }
    if (!(await isUserCheckerOwner(redisClient, res, userId, checkerId))) {
        return;
    }
    if (!validateCheckLengths(checkBlueprint, res)) {
        return;
    }

    const validateCheckErr = validateCheckBlueprint(checkBlueprint);
    if (validateCheckErr !== "") {
        // the check blueprint is invalid. so disable it in the checker
        const rawCheckerBlueprint = await redisClient.get(
            `checkers/${checkerId}`,
        );
        if (!rawCheckerBlueprint) {
            sendBadRequest(res, "Checker not found");
            return;
        }
        const checkerBlueprint = JSON.parse(rawCheckerBlueprint);
        checkerBlueprint.checkStatuses[checkId].isEnabled = false;
        await redisClient.set(
            `checkers/${checkerId}`,
            JSON.stringify(checkerBlueprint),
        );

        await disableCheckerIfHasNoEnabledChecks(
            redisClient,
            checkerBlueprint,
            checkerId,
        );
    }

    checkBlueprint.objInfo.creatorId = userId; // override just for security purposes

    const positiveExamples = checkBlueprint.positiveExamples;
    for (const example of positiveExamples) {
        if (checkBlueprint.checkType !== CheckType.rephrase) {
            example.editedText = ""; // clear, so users can't pass in bad data
        }
    }

    await redisClient.set(
        `checks/${checkId}`,
        JSON.stringify(checkBlueprint), // TODO: compress this
    );

    return204Status(res);
}

const validateCheckLengths = (
    checkBlueprint: CheckBlueprint,
    res: NextApiResponse,
): boolean => {
    const err = validateCheckLengthsHelper(checkBlueprint);
    if (err !== "") {
        sendBadRequest(res, err);
        return false;
    }
    return true;
};

export const validateCheckLengthsHelper = (
    checkBlueprint: CheckBlueprint,
): string => {
    if (checkBlueprint.objInfo.name.length > MAX_CHECK_NAME_LEN) {
        return `Check name cannot be longer than ${MAX_CHECK_NAME_LEN} characters`;
    } else if (checkBlueprint.objInfo.desc.length > MAX_CHECK_DESC_LEN) {
        return `Check description cannot be longer than ${MAX_CHECK_DESC_LEN} characters`;
    } else if (checkBlueprint.instruction.length > MAX_CHECK_INSTR_LEN) {
        return `Check instruction cannot be longer than ${MAX_CHECK_INSTR_LEN} characters`;
    } else if (checkBlueprint.category.length > MAX_CHECK_CATEGORY_LEN) {
        return `Check category cannot be longer than ${MAX_CHECK_CATEGORY_LEN} characters`;
    }
    for (const example of checkBlueprint.positiveExamples) {
        if (example.originalText.length > MAX_POSITIVE_EX_ORIGINAL_TEXT_LEN) {
            return `Positive example original text cannot be longer than ${MAX_POSITIVE_EX_ORIGINAL_TEXT_LEN} characters`;
        }
        if (
            checkBlueprint.checkType === CheckType.rephrase &&
            example.editedText!.length > MAX_POSITIVE_EX_EDITED_TEXT_LEN
        ) {
            return `Positive example rephrased text cannot be longer than ${MAX_POSITIVE_EX_EDITED_TEXT_LEN} characters`;
        }
    }
    return "";
};
