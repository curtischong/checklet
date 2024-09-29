/* eslint-disable @typescript-eslint/no-empty-function */
"use client";

import { SuggestionCard } from "@/app/checker/[checkerId]/editor/suggestions/SuggestionCard";

export const DemoSuggestionCard = () => {
  const suggestion = {
    tipName: "Shorten Months",
    reason:
      "It conveys the same message with fewer letters, creating more whitespace.",
    oldText: "August",
    newText: "Aug",
    range: {
      start: 0,
      end: 0,
    },
    suggestionId: "fakeid",
  };
  return (
    <SuggestionCard
      suggestion={suggestion}
      onClick={() => {}}
      onReplaceClick={() => {}}
      activeSuggestion={suggestion}
    />
  );
};
