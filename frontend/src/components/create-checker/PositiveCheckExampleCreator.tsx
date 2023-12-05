import { TextButton } from "@components/Button";
import { LabelWithHelp } from "@components/LabelWithHelp";
import { NormalTextArea } from "@components/TextArea";
import ThinLine from "@components/ThinLine";
import {
    CheckType,
    PositiveCheckExample,
} from "@components/create-checker/CheckerTypes";
import { HelpIcon } from "@components/icons/HelpIcon";
import { SetState } from "@utils/types";
import React from "react";

interface Props {
    checkType: CheckType;
    onCreate: (example: PositiveCheckExample) => void;
    originalText: string;
    setOriginalText: SetState<string>;
    editedText: string;
    setEditedText: SetState<string>;
}

// TODO: add negative check example creator
export const PositiveCheckExampleCreator = ({
    checkType,
    onCreate,
    originalText,
    setOriginalText,
    editedText,
    setEditedText,
}: Props): JSX.Element => {
    return (
        <div className="flex flex-col ">
            <ThinLine className="mt-4" />
            <div>Create Positive Example</div>
            <div className="flex items-center mt-2">
                <label className="text-md">Original Text</label>
                <HelpIcon
                    text="The model should follow your instructions when it sees this text"
                    className="ml-2 "
                />
            </div>
            <NormalTextArea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="January"
            />
            {checkType === CheckType.rephrase && (
                <>
                    <LabelWithHelp
                        label="Rephrase into"
                        helpText="If you want to rephrase something, this will teach the model how to rephrase it"
                        className="mt-2"
                    />
                    <NormalTextArea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        placeholder="Jan"
                    />
                </>
            )}
            <TextButton
                disabled={originalText === "" || editedText === ""}
                onClick={() => {
                    onCreate({
                        originalText,
                        editedText,
                    });
                    setOriginalText("");
                    setEditedText("");
                }}
            >
                Create
            </TextButton>
        </div>
    );
};
