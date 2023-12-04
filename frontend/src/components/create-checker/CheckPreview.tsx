import { Suggestion } from "@api/ApiTypes";
import {
    CheckBlueprint,
    CheckDesc,
    CheckType,
    PositiveCheckExample,
} from "@components/create-checker/CheckerTypes";
import { SuggestionCollapse } from "@components/editor/suggestions/suggestionCollapse";
import { useMemo } from "react";

interface Props {
    checkBlueprint: CheckBlueprint;
}

export const CheckPreview = ({ checkBlueprint }: Props): JSX.Element => {
    const checkId = "checkId";

    const defaultOriginalTextForCheckType = useMemo(() => {
        switch (checkBlueprint.checkType) {
            case CheckType.highlight:
                return "FSD";
            case CheckType.rephrase:
                return "January";
            // case CheckType.proposal:
            //     return "January";
            default:
                throw new Error(
                    `Unknown feedback type ${checkBlueprint.checkType}`,
                );
        }
    }, [checkBlueprint.checkType]);

    const defaultEditedTextForCheckType = useMemo(() => {
        switch (checkBlueprint.checkType) {
            case CheckType.highlight:
                return "";
            case CheckType.rephrase:
                return "Jan";
            // case CheckType.proposal:
            //     return "Jan";
            default:
                throw new Error(
                    `Unknown feedback type ${checkBlueprint.checkType}`,
                );
        }
    }, [checkBlueprint.checkType]);

    const suggestion: Suggestion = {
        checkId,
        range: {
            start: 0,
            end: 0,
        },
        originalText:
            checkBlueprint.positiveExamples.length > 0
                ? checkBlueprint.positiveExamples[0].originalText
                : defaultOriginalTextForCheckType,
        editedText:
            checkBlueprint.positiveExamples.length > 0
                ? checkBlueprint.positiveExamples[0].editedText ?? ""
                : defaultEditedTextForCheckType,
        suggestionId: "suggestionId",
        editOps: [],
    };

    const defaultNameForCheckType = useMemo(() => {
        switch (checkBlueprint.checkType) {
            case CheckType.highlight:
                return "Unknown Acronym";
            case CheckType.rephrase:
                return "Shorten Month";
            // case CheckType.proposal:
            //     return "Proposal";
            default:
                throw new Error(
                    `Unknown feedback type ${checkBlueprint.checkType}`,
                );
        }
    }, [checkBlueprint.checkType]);

    const defaultLongDescForCheckType = useMemo(() => {
        switch (checkBlueprint.checkType) {
            case CheckType.highlight:
                return "Recruiters may not understand this acronym. Consider expanding it, removing it, or adding a definition.";
            case CheckType.rephrase:
                return "Shorter months create more whitespace.";
            // case CheckType.proposal:
            //     return "Proposal";
            default:
                throw new Error(
                    `Unknown feedback type ${checkBlueprint.checkType}`,
                );
        }
    }, [checkBlueprint.checkType]);

    const defaultCategoryForCheckType = useMemo(() => {
        switch (checkBlueprint.checkType) {
            case CheckType.highlight:
                return "Clarity";
            case CheckType.rephrase:
                return "Whitespace";
            // case CheckType.proposal:
            //     return "Proposal";
            default:
                throw new Error("unknown feedback type");
        }
    }, [checkBlueprint.checkType]);

    const defaultPositiveExamplesForCheckType = useMemo(() => {
        switch (checkBlueprint.checkType) {
            case CheckType.highlight:
                return [
                    {
                        originalText: "FSD",
                    } as PositiveCheckExample,
                ];
            case CheckType.rephrase:
                return [
                    {
                        originalText: "January",
                        editedText: "Jan",
                    } as PositiveCheckExample,
                ];
            // case CheckType.proposal:
            //     return [
            //         {
            //             originalText: "January",
            //             editedText: "Jan",
            //         } as PositiveCheckExample,
            //     ];
            default:
                throw new Error("unknown feedback type");
        }
    }, [checkBlueprint.checkType]);

    const checkDesc: CheckDesc = {
        name: checkBlueprint.name || defaultNameForCheckType,
        longDesc: checkBlueprint.longDesc || defaultLongDescForCheckType,
        category: checkBlueprint.category || defaultCategoryForCheckType,
        positiveExamples:
            checkBlueprint.positiveExamples.length > 0
                ? checkBlueprint.positiveExamples
                : defaultPositiveExamplesForCheckType,
        checkType: checkBlueprint.checkType,
        checkId,
    };

    return (
        <SuggestionCollapse
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
