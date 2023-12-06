import {
    CheckType,
    PositiveCheckExample,
} from "@components/create-checker/CheckerTypes";
import { RightArrowWithTailIcon } from "@components/icons/RightArrowWithTailIcon";

export const PositiveExamplePreview = ({
    example,
    checkType,
}: {
    example: PositiveCheckExample;
    checkType: CheckType;
}): JSX.Element => {
    return (
        <div className="flex flex-row">
            <div className="flex flex-col">
                <div>{example.originalText}</div>
            </div>
            {checkType === CheckType.rephrase && (
                <>
                    <RightArrowWithTailIcon className="mx-4" />
                    <div className="flex flex-col">
                        <div>{example.editedText}</div>
                    </div>
                </>
            )}
        </div>
    );
};
