import {
    DeleteButtonWithConfirm,
    EditButton,
    TextButton,
} from "@components/Button";
import { PositiveExamplePreview } from "@components/create-checker/CheckCreator";
import { CheckBlueprint } from "@components/create-checker/CheckerTypes";

interface Props {
    checkBlueprint: CheckBlueprint;
    onDelete: () => void;
    onEdit: () => void;
}

export const CheckOverview = ({
    checkBlueprint,
    onDelete,
    onEdit,
}: Props): JSX.Element => {
    return (
        <div className="border bg-white rounded-md shadow-around py-3 px-6">
            <div className="flex flex-row items-end">
                <div className="text-lg font-bold">{checkBlueprint.name}</div>
                <div className="ml-4 mb-[2px]">{checkBlueprint.category}</div>
                <div className="ml-auto flex flex-row between-x-0">
                    <EditButton className="px-2" onClick={onEdit} />
                    <DeleteButtonWithConfirm
                        className="px-2 mr-[-10px]"
                        onDelete={onDelete}
                    />
                </div>
            </div>
            {/* <h2>{checkBlueprint.instruction}</h2> */}
            <h2>{checkBlueprint.longDesc}</h2>
            <h2 className="font-bold mt-2">Positive Examples</h2>
            <div className="flex flex-col">
                {/* TODO: do a diff, so we see the red deletion / green insertion */}
                {checkBlueprint.positiveExamples.map((example, idx) => (
                    <div className="flex flex-row" key={`example-${idx}`}>
                        <PositiveExamplePreview
                            example={example}
                            checkType={checkBlueprint.checkType}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
