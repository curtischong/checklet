import { CheckType } from "@components/create-checker/CheckerTypes";

type DefaultTextForCheckType = {
    [key in CheckType]: string;
};

export const defaultOriginalText: DefaultTextForCheckType = {
    [CheckType.highlight]: "FSD",
    [CheckType.rephrase]: "January",
    [CheckType.proposal]: "proposal",
};

type DefaultEditedTextForCheckType = {
    [key in CheckType]: string[];
};

export const defaultEditedText: DefaultEditedTextForCheckType = {
    [CheckType.highlight]: [],
    [CheckType.rephrase]: ["Jan"],
    [CheckType.proposal]: [],
};

export const defaultName: DefaultTextForCheckType = {
    [CheckType.highlight]: "Unknown Acronym",
    [CheckType.rephrase]: "Shorten Month",
    [CheckType.proposal]: "Proposal",
};

export const defaultDesc: DefaultTextForCheckType = {
    [CheckType.highlight]:
        "Recruiters may not understand this acronym. Consider expanding it, removing it, or adding a definition.",
    [CheckType.rephrase]: "Shorter months create more whitespace.",
    [CheckType.proposal]: "Proposal",
};

export const defaultInstructions: DefaultTextForCheckType = {
    [CheckType.highlight]:
        "Highlight any acronyms, abbreviations, or jargon that may be unclear to a recruiter. Do not highlight common abbreviations like GPA or SAT.",
    [CheckType.rephrase]:
        "If you see the name of the month, shorten it to only three characters. Do not end these shortened months with a period.",
    [CheckType.proposal]: "Proposal",
};

export const defaultCategory: DefaultTextForCheckType = {
    [CheckType.highlight]: "Clarity",
    [CheckType.rephrase]: "Whitespace",
    [CheckType.proposal]: "Proposal",
};

export const feedbackTypeDesc = (checkType: CheckType) => {
    switch (checkType) {
        case CheckType.highlight:
            return (
                <div>
                    <div>
                        Highlight checks are used to highlight a section of
                        text. They're useful for pointing out flaws, but don't
                        offer a specific suggestion to fix it.
                    </div>
                    <br />
                    <div>
                        This is useful if you know there's an error, but don't
                        have enough information to suggest a fix.
                    </div>
                </div>
            );
        case CheckType.rephrase:
            return (
                <div>
                    <div>
                        Rephrase checks suggest alternative ways to change the
                        text.
                    </div>
                    <br />
                    <div>
                        This is useful if you know alternative rephrasings of
                        the text. This card is also useful if you want to delete
                        text.
                    </div>
                </div>
            );
        case CheckType.proposal:
            // return (<div><div>Proposal feedbacks allows the model to propose information to the user. They aren't rephrase feedbacks because the proposals presented don't change the text. </div></br><div>This is useful for complex suggestions that can't be easily expressed as a rephrase.</div><div>);
            return (
                <div>
                    <div>
                        Proposal feedbacks allows the model to propose
                        information to the user. They aren't rephrase feedbacks
                        because the proposals presented don't change the text.
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
};
