from typing import List

from core.converters.input.naut_parser import NautDoc, NautToken


def find_first_person_pronoun_indexes_task(naut_doc: NautDoc) -> List[NautToken]:
    pronouns = []
    tokens = naut_doc.tokens
    for i in range(len(tokens)):
        if str(tokens[i]) == "our":
            pronouns.append(tokens[i])
    return pronouns
