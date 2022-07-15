from core.converters.input.naut_parser import NautToken, NautDoc


def extract_contrived_noun_phrases_task(naut_doc: NautDoc) -> list[list[NautToken]]:
    contrived_noun_phrases = []
    for sentence in naut_doc.sentences:
        cur_noun_phrase: list[NautToken] = []
        for token in sentence.tokens:
            if token.is_noun:
                cur_noun_phrase.append(token)
            else:
                # we found a child that isn't part of a noun phrase
                # so push the contrived noun phrase that we have so far if it's long enough
                if len(cur_noun_phrase) >= 3:
                    contrived_noun_phrases.append(cur_noun_phrase)
                cur_noun_phrase = []
        if len(cur_noun_phrase) >= 3:
            contrived_noun_phrases.append(cur_noun_phrase)
    return contrived_noun_phrases
