from typing import List

from core.converters.naut_parser import NautDoc, NautWord


# can we make a generic MAP task? Do we even want that?
def word_index_to_word_task(doc: NautDoc, word_indexes: List[int]) -> List[NautWord]:
    words = []
    doc_words = doc.words()
    for i in word_indexes:
        words.append(doc_words[i])
    return words
