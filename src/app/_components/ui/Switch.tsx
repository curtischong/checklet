import { LabelWithHelp } from "@/app/_components/ui/LabelWithHelp";
import classNames from "classnames";

import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  className,
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={classNames(
        className,
        `relative inline-flex h-[16px] w-[32px] rounded-full transition-colors focus:outline-none focus-visible:ring-[2px] focus-visible:ring-blue-500 focus-visible:ring-offset-2`,
        {
          "bg-blue-400 hover:bg-blue-500": checked,
          "bg-gray-200 hover:bg-gray-300": !checked,
          "cursor-not-allowed opacity-50": disabled,
          "cursor-pointer": !disabled,
        },
      )}
      disabled={disabled}
    >
      <span
        className={`absolute left-[1px] top-[1px] h-[14px] w-[14px] transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-[16px]" : "translate-x-0"
        }`}
      />
    </button>
  );
};

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
      className={classNames(className, {
        "bg-gray-300": !isChecked,
      })}
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
    <div
      className={classNames("flex flex-row items-center space-x-2", className)}
    >
      <LabelWithHelp
        label={text}
        helpText={helpText}
        helpIconClassName={"ml-2"}
      />
      <NormalSwitch isChecked={isChecked} setChecked={setChecked} />
    </div>
  );
};
