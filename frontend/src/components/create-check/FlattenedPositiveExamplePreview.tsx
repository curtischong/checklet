import {
    CheckType,
    PositiveCheckExample,
} from "@components/create-checker/CheckerTypes";
import { RightArrowWithTailIcon } from "@components/icons/RightArrowWithTailIcon";

export const FlattenedPositiveExamplePreview = ({
    example,
    checkType,
}: {
    example: PositiveCheckExample;
    checkType: CheckType;
}): JSX.Element => {
    return (
        <div className="flex flex-row">
            <div className="flex flex-col">
                {/* this is the Pilcrow symbol */}
                <div>{example.originalText.replaceAll("\n", "¶")}</div>
            </div>
            {checkType === CheckType.rephrase && example.editedText && (
                <>
                    <RightArrowWithTailIcon className="mx-4" />
                    <div className="flex flex-col">
                        <div>{example.editedText.replaceAll("\n", "¶")}</div>
                    </div>
                </>
            )}
        </div>
    );
};
