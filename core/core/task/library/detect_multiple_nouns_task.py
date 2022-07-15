from core.converters.input.naut_parser import NautDoc, NautToken
from collections import defaultdict

def detect_multiple_nouns_task(naut_doc: NautDoc) -> list[NautToken]:
    repeated_nouns = []

    for sentence in naut_doc.sentences:
        nouns = [token for token in sentence.tokens if token.is_noun]

        occurrences = defaultdict(list)
        for noun in nouns:
            occurrences[noun.text].append(noun)

        for tokens in occurrences.values():
            if len(tokens) > 1:
                # We highlight the last appearance of the word
                repeated_nouns.append(tokens[-1])

    return repeated_nouns
