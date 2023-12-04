import { LabelWithHelp } from "@components/LabelWithHelp";
import { Switch } from "antd";
import classNames from "classnames";

interface NormalSwitchProps {
    isChecked: boolean;
    setChecked: (isChecked: boolean) => void;
    className?: string;
}
export const NormalSwitch = ({
    isChecked,
    setChecked,
    className = "",
}: NormalSwitchProps): JSX.Element => {
    return (
        <Switch
            checked={isChecked}
            onChange={() => {
                setChecked(!isChecked);
            }}
            size="small"
            className={className}
        />
    );
};

type LabelWithSwitchProps = {
    text: string;
    className?: string;
    helpText: string;
} & NormalSwitchProps;

export const LabelWithSwitch = ({
    isChecked,
    setChecked,
    text,
    className = "",
    helpText,
}: LabelWithSwitchProps): JSX.Element => {
    return (
        <div className={classNames("flex flex-row", className)}>
            <LabelWithHelp label={text} helpText={helpText} />
            <NormalSwitch
                isChecked={isChecked}
                setChecked={setChecked}
                className="mt-[3px] ml-2"
            />
        </div>
    );
};
