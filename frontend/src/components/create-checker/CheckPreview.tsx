import { Suggestion } from "@api/ApiTypes";
import {
    CheckBlueprint,
    CheckDesc,
    CheckDescObj,
    PositiveCheckExample,
} from "@components/create-checker/CheckerTypes";
import { SuggestionCollapse } from "@components/editor/suggestions/suggestionCollapse";

interface Props {
    checkBlueprint: CheckBlueprint;
}

export const CheckPreview = ({ checkBlueprint }: Props): JSX.Element => {
    const checkId = "checkId";
    const suggestion: Suggestion = {
        checkId,
        range: {
            start: 0,
            end: 0,
        },
        originalText:
            checkBlueprint.positiveExamples.length > 0
                ? checkBlueprint.positiveExamples[0].originalText
                : "January",
        editedText:
            checkBlueprint.positiveExamples.length > 0
                ? checkBlueprint.positiveExamples[0].editedText
                : "Jan",
        suggestionId: "suggestionId",
        editOps: [],
    };

    const checkDesc: CheckDesc = {
        name: checkBlueprint.name || "Shorten Month",
        longDesc:
            checkBlueprint.longDesc || "Shorter months create more whitespace.",
        category: checkBlueprint.category || "Whitespace",
        positiveExamples:
            checkBlueprint.positiveExamples.length > 0
                ? checkBlueprint.positiveExamples
                : [
                      {
                          originalText: "January",
                          editedText: "Jan",
                      } as PositiveCheckExample,
                  ],
        checkId,
    };

    return (
        <div
            className="flex-grow min-w-0"
            // flex basis isn't supported in this version of tailwind
            style={{
                flexBasis: "0",
            }}
        >
            <div className="fixed mx-auto w-[30vw] left-[50%] right-0 mt-10">
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
