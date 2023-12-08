import { NormalButton, TextButton } from "@components/Button";
import { LabelWithHelp } from "@components/LabelWithHelp";
import { NormalTextArea } from "@components/TextArea";
import ThinLine from "@components/ThinLine";
import {
    CheckType,
    PositiveCheckExample,
} from "@components/create-checker/CheckerTypes";
import { defaultOriginalText } from "@components/create-check/DefaultTextForCheckType";
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
    const isTextTheSame = originalText === editedText;
    return (
        <div className="flex flex-col ">
            <ThinLine className="mt-4" />
            <div className="font-bold text-lg">Create Positive Example</div>
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
                placeholder={defaultOriginalText[checkType]}
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
            <div>
                {originalText !== "" && isTextTheSame && (
                    <div className="text-red-500">
                        Original text and edited text should not be the same
                    </div>
                )}
            </div>
            <NormalButton
                disabled={originalText === "" || isTextTheSame}
                className="px-10 py-[6px] w-[240px] mt-4"
                onClick={() => {
                    onCreate({
                        originalText,
                        editedText,
                    });
                    setOriginalText("");
                    setEditedText("");
                }}
            >
                Create Positive Example
            </NormalButton>
        </div>
    );
};
