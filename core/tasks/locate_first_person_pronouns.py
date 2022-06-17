from typing import List

from core.converters.tokenizer import NautDoc


def locate_first_person_pronouns_task(doc: NautDoc) -> List[int]:
    first_person_pronoun_indexes = []
    tokens = doc.tokens()
    for i in range(len(tokens)):
        if str(tokens[i]) == "our":
            first_person_pronoun_indexes.append(i)
    return first_person_pronoun_indexes
