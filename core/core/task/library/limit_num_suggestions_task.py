def limit_num_suggestions_task(all_suggestions: list[list[str]], max_suggestions: int) -> list[list[str]]:
    filtered_suggestions = []
    for suggestions in all_suggestions:
        filtered_suggestions.append(suggestions[:max_suggestions])
    return filtered_suggestions
