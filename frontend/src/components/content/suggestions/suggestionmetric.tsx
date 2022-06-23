import React from "react";
import { LengthMetric } from "./suggestionsTypes";

export const SuggestionMetric: React.FC<LengthMetric> = (
    props: LengthMetric,
) => {
    const { name, value, isTime } = props;
    const displayValue = React.useCallback(() => {
        if (isTime) {
            const hours = Math.floor(value / 3600);
            const minutes = Math.floor((value - hours * 3600) / 60);
            const seconds = value - hours * 3600 - minutes * 60;

            let result = "";
            if (hours < 10) result = "0";
            result += hours + ":";
            if (minutes < 10) result += "0";
            result += minutes + ":";
            if (seconds < 10) result += "0";
            result += seconds;
            return result;
        }
        return value;
    }, []);
    return (
        <div className="flex">
            {name}:{"\u00A0"}
            <div className="font-bold">{displayValue()}</div>
        </div>
    );
};
