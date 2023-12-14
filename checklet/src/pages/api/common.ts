import { RedisClient, sendBadRequest } from "@/pages/api/commonNetworking";
import { CheckerId } from "@api/checker";
import {
    CheckBlueprint,
    CheckId,
    CheckType,
    CheckerBlueprint,
    CheckerStorefront,
    ObjInfo,
    validCheckTypes,
} from "@components/create-checker/CheckerTypes";
import { isLegitShortId } from "@utils/strings";
import { NextApiResponse } from "next";

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
    checkId: CheckId,
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
        placeholder: blueprint.placeholder,
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
    if (checkerBlueprint.placeholder === "") {
        return "Checker placeholder cannot be empty";
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

const validatePositiveExamples = (checkBlueprint: CheckBlueprint) => {
    const isRephraseCheck = checkBlueprint.checkType === CheckType.rephrase;
    for (const example of checkBlueprint.positiveExamples) {
        if (example.originalText === "") {
            return "Positive example original text cannot be empty";
        }

        if (isRephraseCheck) {
            for (const option of example.editedText) {
                if (example.originalText === option) {
                    return `Positive example cannot have the same originalText and rephrased text. Original text: ${example.originalText}`;
                }
            }
        }

        const uniqueEditedTexts = new Set();
        for (const option of example.editedText) {
            if (uniqueEditedTexts.has(option)) {
                return `Positive example rephrased texts must be unique. This rephrased text is duplicated: ${option}`;
            }
            uniqueEditedTexts.add(option);
        }
    }

    const uniqueOriginalTexts = new Set();
    for (const example of checkBlueprint.positiveExamples) {
        if (uniqueOriginalTexts.has(example.originalText)) {
            return `Positive example original texts must be unique. This original text is duplicated: ${example.originalText}`;
        }
        uniqueOriginalTexts.add(example.originalText);
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
