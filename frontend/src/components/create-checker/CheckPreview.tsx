import { Suggestion } from "@api/ApiTypes";
import {
    CheckBlueprint,
    CheckDesc,
    CheckType,
    PositiveCheckExample,
} from "@components/create-checker/CheckerTypes";
import { SuggestionCollapse } from "@components/editor/suggestions/suggestionCollapse";
import { useCallback, useMemo } from "react";

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
                ? checkBlueprint.positiveExamples[0].editedText
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

    const feedbackTypeDesc = useMemo(() => {
        switch (checkBlueprint.checkType) {
            case CheckType.highlight:
                return (
                    <div>
                        <div>
                            Highlight feedbacks are used to highlight a section
                            of text. They're useful for pointing out flaws, but
                            don't offer a specific suggestion to fix it.
                        </div>
                        <br />
                        <div>
                            This is useful if you know there's an error, but
                            don't have enough information to suggest a fix.
                        </div>
                    </div>
                );
            case CheckType.rephrase:
                return (
                    <div>
                        <div>
                            Rephrase feedbacks suggest alternative ways to
                            change the text.
                        </div>
                        <br />
                        <div>
                            This is useful if you know alternative rephrasings
                            of the text.
                        </div>
                    </div>
                );
            case CheckType.proposal:
                // return (<div><div>Proposal feedbacks allows the model to propose information to the user. They aren't rephrase feedbacks because the proposals presented don't change the text. </div></br><div>This is useful for complex suggestions that can't be easily expressed as a rephrase.</div><div>);
                return (
                    <div>
                        <div>
                            Proposal feedbacks allows the model to propose
                            information to the user. They aren't rephrase
                            feedbacks because the proposals presented don't
                            change the text.
                        </div>
                        <br />
                        <div>
                            This is useful for complex suggestions that can't be
                            easily expressed as a rephrase.
                        </div>
                    </div>
                );
            default:
                throw new Error("unknown feedback type");
        }
    }, [checkBlueprint.checkType]);

    return (
        <div
            className="flex-grow min-w-0"
            // flex basis isn't supported in this version of tailwind
            style={{
                flexBasis: "0",
            }}
        >
            <div className="fixed mx-auto w-[30vw] left-[50%] right-0 mt-10">
                <div className="flex flex-col mb-10 ml-1">
                    <div className=" flex flex-row">
                        <div className="font-bold text-lg">
                            {checkBlueprint.checkType} Feedback
                        </div>
                    </div>
                    <div className="mt-2">{feedbackTypeDesc}</div>
                </div>
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
            </div>
        </div>
    );
};
