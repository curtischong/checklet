from typing import List

from core.converters.naut_parser import NautDoc


def find_first_person_pronoun_indexes_task(naut_doc: NautDoc) -> List[int]:
    indexes = []
    words = naut_doc.words
    for i in range(len(words)):
        if str(words[i]) == "our":
            indexes.append(i)
    return indexes
