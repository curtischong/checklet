from core.converters.input.naut_parser import NautDoc, NautToken


# if src_match_rule == "match_case", only exact matches will be replaced
def find_and_replace_task(naut_doc: NautDoc, src_match_rule: str,
                          find_and_replace_pairs: list[tuple[list[str], str]]) -> \
        tuple[list[list[NautToken]], list[str]]:
    tokens_to_replace = []
    replacement_text = []

    all_tokens = naut_doc.tokens
    # TODO: replace with KMP
    for phrases_to_find, replacement in find_and_replace_pairs:
        for phrase_to_find in phrases_to_find:
            tokens_to_find = phrase_to_find.split(" ")
            find_len = len(tokens_to_find)
            n = len(all_tokens)
            for search_start in range(n - find_len + 1):
                for i in range(find_len):
                    src_text = all_tokens[search_start + i].text
                    target_text = tokens_to_find[i]
                    if src_match_rule != "match_case":
                        src_text = src_text.upper()
                    target_text = target_text.upper()

                    if src_text != target_text:
                        break
                else:
                    # we didn't early break out of the for loop. So we found all tokens!
                    tokens_to_replace.append(all_tokens[search_start: search_start + find_len])
                    replacement_text.append(replacement)
    return tokens_to_replace, replacement_text
