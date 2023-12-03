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
    // <SuggestionCollapse suggestion={}
    //    activeSuggestion={undefined}
    //    onClick: () => void;
    //    onReplaceClick: () => void;
    //    checkDescObj: CheckDescObj;
    // />
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
                : "",
        editedText:
            checkBlueprint.positiveExamples.length > 0
                ? checkBlueprint.positiveExamples[0].editedText
                : "",
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
        <div className="flex flex-col flex-grow justify-center items-center ">
            <div className="w-[30vw] mx-auto my-auto">
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
