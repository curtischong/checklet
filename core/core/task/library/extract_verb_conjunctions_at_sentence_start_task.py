from core.converters.input.naut_parser import NautDoc, NautToken


def extract_verb_conjunctions_at_sentence_start_task(naut_doc: NautDoc) -> list[list[NautToken]]:
    verb_conjunctions = []
    for sentence in naut_doc.sentences:
        tokens = sentence.tokens
        if len(tokens) < 3:
            continue
        if (tokens[0].pos == "VERB" and
                (tokens[1].pos == "CONJ" or tokens[1].pos == "CCONJ") and
                tokens[2].pos == "VERB"):
            # TODO: consider making a task to remove pos tags given a list of tokens
            # that way, we can just return tokens[:3] in this task, then just drop
            # the conjunction in that second task
            # e.g. in the second task: [led, and, organized] -> [led, organized]
            verb_conjunctions.append([tokens[0], tokens[2]])
    return verb_conjunctions
