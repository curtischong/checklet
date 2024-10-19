import { RightArrowIcon } from "@/app/_components/icons/RightArrowIcon";
import { LabelWithHelp } from "@/app/_components/ui/LabelWithHelp";
import { useState } from "react";

interface Props<T> {
  label: string;
  options: T[];
  className?: string;
  helpText?: string;
}

interface Dropdown<T> extends Props<T> {
  defaultSelected: T;
}

export const Dropdown = <T,>(props: Dropdown<T>) => {
  const [selected, setSelected] = useState<T>(props.defaultSelected);
  return (
    <DropdownWithoutState
      {...props}
      selected={selected}
      setSelected={setSelected}
    />
  );
};

interface DropdownWithoutStateProps<T> extends Props<T> {
  setSelected: (selected: T) => void;
  selected: T;
}

export const DropdownWithoutState = <T,>({
  label,
  options,
  selected,
  setSelected,
  className = "",
  helpText,
}: DropdownWithoutStateProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: T) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className={`flex flex-row space-x-2`}>
      {helpText ? (
        <LabelWithHelp
          className={"mr-2 self-center"}
          helpText={helpText}
          label={label}
        />
      ) : (
        <p className="self-center">{label}</p>
      )}
      <div className={`relative ${className}`}>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-gray-700">
            {String(selected) ?? "select an option"}
          </span>
          <RightArrowIcon
            className={`ml-2 h-4 w-4 text-slate-400 transition-transform ${isOpen ? "-rotate-90" : "rotate-90"}`}
          />
        </button>

        {isOpen && options.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
            <ul className="max-h-60 overflow-auto py-1">
              {options.map((option) => (
                <li
                  key={String(option)}
                  className={`cursor-pointer px-4 py-2 text-sm ${
                    selected === option
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {String(option)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
