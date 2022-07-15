from core.converters.input.naut_parser import NautToken, NautSent


# TODO: consider making List[List[List[NautToken]]] cleaner since it looks pretty hacky rn
def verb_clauses_in_long_sentences_task(clauses_in_sentences: list[list[list[NautToken]]],
                                        long_sentences: list[NautSent]) -> list[list[list[NautToken]]]:
    long_sentence_ids = set([sent.idx for sent in long_sentences])
    clauses_in_long_sentences = []
    for clauses_in_sentence in clauses_in_sentences:
        enclosing_sentence: NautSent = clauses_in_sentence[0][0].naut_sent
        if enclosing_sentence.idx in long_sentence_ids:
            clauses_in_long_sentences.append(clauses_in_sentence)
    return clauses_in_long_sentences
