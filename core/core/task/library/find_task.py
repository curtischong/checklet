from core.converters.input.naut_parser import NautDoc, NautToken
from core.task.library.find_and_replace_task import find_and_replace_task


# if src_match_rule == "match_case", only exact matches will be replaced
def find_task(naut_doc: NautDoc, src_match_rule: str, find_text: list[list[str]]) -> list[list[NautToken]]:
    find_and_replace_pairs = []
    for text in find_text:
        find_and_replace_pairs.append((text, ""))

    tokens_to_replace, _ = find_and_replace_task(naut_doc, src_match_rule, find_and_replace_pairs)
    return tokens_to_replace
