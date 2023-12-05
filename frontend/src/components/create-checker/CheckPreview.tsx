import { Suggestion } from "@api/ApiTypes";
import {
    CheckBlueprint,
    CheckDesc,
} from "@components/create-checker/CheckerTypes";
import {
    defaultCategory,
    defaultDesc,
    defaultEditedText,
    defaultName,
    defaultOriginalText,
} from "@components/create-checker/DefaultTextForCheckType";
import { SuggestionCard } from "@components/editor/suggestions/SuggestionCard";
import { useMemo } from "react";

interface Props {
    blueprint: CheckBlueprint;
    originalText: string; // This is the input boxes the user is using to create the positive example. It's here so users can easily understand what part of the check they're changing
    editedText: string;
}

export const CheckPreview = ({
    blueprint,
    originalText,
    editedText,
}: Props): JSX.Element => {
    const checkId = "checkId";

    const originalTextToUse = useMemo(() => {
        if (originalText !== "" || editedText !== "") {
            return originalText;
        } else if (blueprint.positiveExamples.length > 0) {
            return blueprint.positiveExamples[0].originalText;
        } else {
            return defaultOriginalText[blueprint.checkType];
        }
    }, [originalText, editedText, blueprint.positiveExamples]);

    const editedTextToUse = useMemo(() => {
        if (editedText !== "" || originalText !== "") {
            return editedText;
        } else if (blueprint.positiveExamples.length > 0) {
            return blueprint.positiveExamples[0].editedText;
        } else {
            return defaultEditedText[blueprint.checkType];
        }
    }, [originalText, editedText, blueprint.positiveExamples]);

    const suggestion: Suggestion = {
        checkId,
        range: {
            start: 0,
            end: 0,
        },
        originalText: originalTextToUse,
        editedText: editedTextToUse,
        suggestionId: "suggestionId",
        editOps: [],
    };

    const defaultPositiveExamplesForCheckType = useMemo(() => {
        return [
            {
                originalText: defaultOriginalText[blueprint.checkType],
                editedText: defaultEditedText[blueprint.checkType],
            },
        ];
    }, [blueprint.checkType]);

    const checkDesc: CheckDesc = {
        name: blueprint.name || defaultName[blueprint.checkType],
        desc: blueprint.desc || defaultDesc[blueprint.checkType],
        category: blueprint.category || defaultCategory[blueprint.checkType],
        positiveExamples:
            blueprint.positiveExamples.length > 0
                ? blueprint.positiveExamples
                : defaultPositiveExamplesForCheckType,
        checkType: blueprint.checkType,
        checkId,
    };

    return (
        <SuggestionCard
            suggestion={suggestion}
            activeSuggestion={suggestion}
            onClick={() => {
                return;
            }}
            onReplaceClick={() => {
                return;
            }}
            checkDescObj={{
                [checkId]: checkDesc,
            }}
        />
    );
};
