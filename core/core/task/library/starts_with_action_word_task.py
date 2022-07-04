from core.converters.input.naut_parser import NautDoc, NautToken

def starts_with_action_word_task(naut_doc: NautDoc) -> list[NautToken]:
    first_nonaction_words = []
    for sentence in naut_doc.sentences:
        if len(sentence.tokens) > 0:
            first_word = sentence.tokens[0]
            if first_word.pos != "VERB":
                first_nonaction_words.append(first_word)
    return first_nonaction_words
