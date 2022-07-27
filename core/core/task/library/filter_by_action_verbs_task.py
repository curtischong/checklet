from core.lib.corpus.action_verbs import ActionVerbs


def filter_by_action_verbs_task(texts: list[list[str]], action_verbs: ActionVerbs) -> list[list[str]]:
    filtered_texts = []
    for text in texts:
        filtered_text = []
        for word in text:
            if action_verbs.in_action_verbs(word):
                filtered_text.append(word)
        filtered_texts.append(filtered_text)
    return filtered_texts
