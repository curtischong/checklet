from naut_parser import NautDoc


def find_word_indexes_task(naut_doc: NautDoc, bag: list[str]) -> list[NautDoc]:
    words: list[NautDoc] = []
    for token in naut_doc.tokens:
        if str(token) in bag:
            words.append(token)
    return words
