from typing import List

from core.converters.tokenizer import NautDoc


def find_first_person_pronoun_indexes_task(doc: NautDoc) -> List[int]:
    indexes = []
    tokens = doc.tokens()
    for i in range(len(tokens)):
        if str(tokens[i]) == "our":
            indexes.append(i)
    return indexes
