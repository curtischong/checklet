from core.converters.input.naut_parser import NautDoc, NautToken


def use_specific_numbers_task(naut_doc: NautDoc) -> list[NautToken]:
    many_words = []
    tokens = naut_doc.tokens
    for i in range(len(tokens)):
        if str(tokens[i]) == "many":
            many_words.append(tokens[i])
    return many_words
