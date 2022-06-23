from typing import List

from core.converters.input.naut_parser import NautDoc, NautSent


def filter_sentences_geq_length_task(naut_doc: NautDoc) -> List[NautSent]:
    long_sentences = []
    for sentence in naut_doc.sentences:
        # A one-line bullet point is around 100 chars on a resume
        if sentence.num_chars() >= 120:
            long_sentences.append(sentence)
    return long_sentences
