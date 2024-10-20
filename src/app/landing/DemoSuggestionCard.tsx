/* eslint-disable @typescript-eslint/no-empty-function */
"use client";

import SuggestionCard2 from "@/app/checker/[checkerId]/editor/suggestions/SuggestionCard2";

export const DemoSuggestionCard = () => {
  const suggestion = {
    tipName: "Shorten Months",
    reason:
      "It conveys the same message with fewer letters, creating more whitespace.",
    oldText: "August",
    newText: "Aug.",
    range: {
      start: 0,
      end: 0,
    },
    suggestionId: "fakeid",
  };
  return (
    <SuggestionCard2
      suggestion={suggestion}
      onClick={() => {}}
      onAccept={() => {}}
      onDismiss={() => {}}
      onRegenerate={() => {}}
      isRegenerating={false}
      activeSuggestion={suggestion}
    />
  );
};

export const DemoSuggestionCard2 = () => {
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
    <SuggestionCard2
      suggestion={suggestion}
      onClick={() => {}}
      onAccept={() => {}}
      onDismiss={() => {}}
      onRegenerate={() => {}}
      isRegenerating={false}
      activeSuggestion={suggestion}
    />
  );
};
