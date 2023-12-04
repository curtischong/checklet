import { Switch } from "antd";

interface NormalSwitchProps {
    isChecked: boolean;
    setChecked: (isChecked: boolean) => void;
}
export const NormalSwitch = ({
    isChecked,
    setChecked,
}: NormalSwitchProps): JSX.Element => {
    return (
        <Switch
            checked={isChecked}
            onChange={() => {
                setChecked(!isChecked);
            }}
        />
    );
};

type LabelWithSwitchProps = {
    text: string;
} & NormalSwitchProps;

export const LabelWithSwitch = ({
    isChecked,
    setChecked,
    text,
}: LabelWithSwitchProps): JSX.Element => {
    return (
        <div className="flex flex-row">
            <label>{text}</label>
            <NormalSwitch isChecked={isChecked} setChecked={setChecked} />
        </div>
    );
};
