from core.converters.input.naut_parser import NautDoc, NautToken


def filter_first_words_task(naut_doc: NautDoc) -> list[NautToken]:
    first_words = []
    for sentence in naut_doc.sentences:
        if len(sentence.tokens) > 0:
            first_words.append(sentence.tokens[0])
    return first_words
