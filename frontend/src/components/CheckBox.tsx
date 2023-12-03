import { SetState } from "@utils/types";

interface Props {
    label: string;
    isChecked: boolean;
    setIsChecked: SetState<boolean>;
}

export const CheckBox = ({
    label,
    isChecked,
    setIsChecked,
}: Props): JSX.Element => {
    return (
        <div className="flex flex-row mt-2 mb-2">
            <input
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
            ></input>
            <label className="ml-2"> {label}</label>
            <br></br>
        </div>
    );
};
