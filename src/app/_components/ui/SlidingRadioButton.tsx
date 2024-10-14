import { type SetState } from "@/utils/types";
import classNames from "classnames";

interface Props<Option = string> {
  options: Option[];
  selected: Option;
  setSelected: SetState<Option> | ((newOption: Option) => void);
  className?: string;
}
export const SlidingRadioButton = ({
  options,
  selected,
  setSelected,
  className,
}: Props): JSX.Element => {
  return (
    <div
      className={classNames(
        `border-1 mx-auto flex flex-row space-x-1 rounded-lg border border-gray-400 p-1`,
        className,
      )}
    >
      {options.map((option) => {
        return (
          <div
            key={`sliding-radio-${option}`}
            onClick={() => setSelected(option)}
            className={classNames(
              "cursor-pointer select-none rounded-md px-2 py-[1px] text-sm transition duration-300",
              {
                "bg-[#dadada]": selected === option,
                "hover:bg-[#e6e6e6]": selected !== option,
              },
            )}
          >
            {option}
          </div>
        );
      })}
    </div>
  );
};
