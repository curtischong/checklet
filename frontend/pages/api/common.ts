import { CheckerId } from "@api/checker";
import {
    CheckBlueprint,
    CheckType,
    CheckerBlueprint,
    CheckerStorefront,
    ObjInfo,
    validCheckTypes,
} from "@components/create-checker/CheckerTypes";
import { isLegitShortId } from "@utils/strings";
import { NextApiResponse } from "next";
import { RedisClient, sendBadRequest } from "pages/api/commonNetworking";
import {
    MAX_CHECKER_DESC_LEN,
    MAX_CHECKER_NAME_LEN,
    MAX_CHECK_CATEGORY_LEN,
    MAX_CHECK_DESC_LEN,
    MAX_POSITIVE_EX_EDITED_TEXT_LEN,
    MAX_CHECK_INSTR_LEN,
    MAX_CHECK_NAME_LEN,
    MAX_POSITIVE_EX_ORIGINAL_TEXT_LEN,
} from "src/constants";

export const isUserCheckerOwner = async (
    redisClient: RedisClient,
    res: NextApiResponse,
    userId: string,
    checkerId: CheckerId,
): Promise<boolean> => {
    if (
        !(await redisClient.sIsMember(`users/${userId}/checkerIds`, checkerId))
    ) {
        sendBadRequest(
            res,
            "You did not create this checker. You cannot read/edit it",
        );
        return false;
    }
    return true;
};

export const isUserCheckOwner = async (
    redisClient: RedisClient,
    res: NextApiResponse,
    userId: string,
    checkId: CheckerId,
): Promise<boolean> => {
    if (!(await redisClient.sIsMember(`users/${userId}/checkIds`, checkId))) {
        sendBadRequest(
            res,
            "You did not create this check. You cannot edit it",
        );
        return false;
    }
    return true;
};

export const checkerBlueprintToCheckerStorefront = (
    blueprint: CheckerBlueprint,
): CheckerStorefront => {
    return {
        objInfo: blueprint.objInfo,
    };
};

export const validateObjInfo = (objInfo: ObjInfo): string => {
    if (objInfo.name === "") {
        return "Checker description cannot be empty";
    } else if (objInfo.desc === "") {
        return "Checker description cannot be empty";
    } else if (!isLegitShortId(objInfo.id)) {
        return "Checker id is not legit";
    }

    // TODO: validate that the user exists
    return "";
};

export const validateCheckType = (checkType: CheckType): string => {
    if (!validCheckTypes.includes(checkType)) {
        return `Check type must be one of [${validCheckTypes.join(
            ", ",
        )}]. Got ${checkType}`;
    }
    return "";
};

export const validateChecker = async (
    redisClient: RedisClient,
    userId: string,
    checkerBlueprint: CheckerBlueprint,
): Promise<string> => {
    const objInfoErr = validateObjInfo(checkerBlueprint.objInfo);
    if (objInfoErr !== "") {
        return objInfoErr;
    }

    if (checkerBlueprint.objInfo.name.length > MAX_CHECKER_NAME_LEN) {
        return `Checker name cannot be longer than ${MAX_CHECKER_NAME_LEN} characters`;
    }
    if (checkerBlueprint.objInfo.desc.length > MAX_CHECKER_DESC_LEN) {
        return `Checker description cannot be longer than ${MAX_CHECKER_DESC_LEN} characters`;
    }

    const checkIds = Object.keys(checkerBlueprint.checkStatuses);
    if (checkIds.length === 0) {
        return "Checker must have at least one check";
    }
    const hasOneEnabledCheck = Object.values(
        checkerBlueprint.checkStatuses,
    ).some((checkStatus) => checkStatus.isEnabled);
    if (!hasOneEnabledCheck) {
        return "Checker must have at least one enabled check";
    }

    // PERF: batch this
    for (const checkId of checkIds) {
        if (
            !(await redisClient.sIsMember(`users/${userId}/checkIds`, checkId))
        ) {
            return `You do not own the check with id ${checkId}`;
        }
    }

    // we don't need to validate checks. Since we validate them before they are enabled
    return "";
};

// this function assumes that the validation logic used to see if the user is the owner of the checker has passed
export const getCheckBlueprints = async (
    redisClient: RedisClient,
    checkerBlueprint: CheckerBlueprint,
    onlyGetIsEnabled: boolean,
): Promise<CheckBlueprint[]> => {
    const checkStatuses = Object.entries(checkerBlueprint.checkStatuses);
    const filteredStatuses = onlyGetIsEnabled
        ? checkStatuses.filter(([_, checkStatus]) => checkStatus.isEnabled)
        : checkStatuses;
    const enabledCheckIds = filteredStatuses.map(
        ([checkId, _checkStatus]) => checkId,
    );

    const checkKeys = enabledCheckIds.map((checkId) => `checks/${checkId}`);
    const rawCheckBlueprints: (string | null)[] =
        checkKeys.length === 0 ? [] : await redisClient.mGet(checkKeys);
    const checkBlueprints: CheckBlueprint[] = [];
    for (let i = 0; i < checkKeys.length; i++) {
        const rawCheckBlueprint = rawCheckBlueprints[i];
        if (rawCheckBlueprint === null) {
            console.error(`rawCheckBlueprint is null for ${checkKeys[i]}`);
            continue;
        }
        checkBlueprints.push(JSON.parse(rawCheckBlueprint));
    }
    return checkBlueprints;
};

export const validateCheckBlueprint = (
    checkBlueprint: CheckBlueprint,
): string => {
    const validateObjInfoErr = validateObjInfo(checkBlueprint.objInfo);
    if (validateObjInfoErr !== "") {
        return validateObjInfoErr;
    }

    const validateCheckLengthsErr = validateCheckLengths(checkBlueprint);
    if (validateCheckLengthsErr !== "") {
        return validateCheckLengthsErr;
    }

    if (checkBlueprint.instruction === "") {
        return "Check instruction cannot be empty";
    } else if (checkBlueprint.positiveExamples.length === 0) {
        return "Check must have at least one positive example";
    }
    const validateCheckTypeErr = validateCheckType(checkBlueprint.checkType);
    if (validateCheckTypeErr !== "") {
        return validateCheckTypeErr;
    }

    return validatePositiveExamples(checkBlueprint);
};

const validateCheckLengths = (checkBlueprint: CheckBlueprint): string => {
    if (checkBlueprint.objInfo.name.length > MAX_CHECK_NAME_LEN) {
        return `Check name cannot be longer than ${MAX_CHECK_NAME_LEN} characters`;
    } else if (checkBlueprint.objInfo.desc.length > MAX_CHECK_DESC_LEN) {
        return `Check description cannot be longer than ${MAX_CHECK_DESC_LEN} characters`;
    } else if (checkBlueprint.instruction.length > MAX_CHECK_INSTR_LEN) {
        return `Check instruction cannot be longer than ${MAX_CHECK_INSTR_LEN} characters`;
    } else if (checkBlueprint.category.length > MAX_CHECK_CATEGORY_LEN) {
        return `Check category cannot be longer than ${MAX_CHECK_CATEGORY_LEN} characters`;
    }
    return "";
};

const validatePositiveExamples = (checkBlueprint: CheckBlueprint) => {
    const isRephraseCheck = checkBlueprint.checkType === CheckType.rephrase;
    for (const example of checkBlueprint.positiveExamples) {
        if (example.originalText === "") {
            return "Positive example original text cannot be empty";
        }
        if (example.originalText.length > MAX_POSITIVE_EX_ORIGINAL_TEXT_LEN) {
            return `Positive example original text cannot be longer than ${MAX_POSITIVE_EX_ORIGINAL_TEXT_LEN} characters`;
        }
        if (isRephraseCheck) {
            if (example.originalText === example.editedText) {
                return "Positive example cannot have the same originalText and rephrased text";
            }
            if (example.editedText!.length > MAX_POSITIVE_EX_EDITED_TEXT_LEN) {
                return `Positive example rephrased text cannot be longer than ${MAX_POSITIVE_EX_EDITED_TEXT_LEN} characters`;
            }
        }
    }
    return "";
};

export const disableCheckerIfNoEnabledChecks = async (
    redisClient: RedisClient,
    checkerBlueprint: CheckerBlueprint,
    checkerId: CheckerId,
): Promise<void> => {
    // if the checker has no other enabled checks, then we should make the checker private
    const checkerHasOtherEnabledChecks = Object.values(
        checkerBlueprint.checkStatuses,
    ).some((checkStatus) => checkStatus.isEnabled);
    if (!checkerHasOtherEnabledChecks) {
        checkerBlueprint.isPublic = false;
        await redisClient.sRem("publicCheckerIds", checkerId);
    }
};
