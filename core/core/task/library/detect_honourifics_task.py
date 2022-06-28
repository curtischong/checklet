from typing import List

from core.converters.input.naut_parser import NautDoc, NautToken

HONOURIFICS = {"HONOURS", "HONORS"}


def detect_honourifics_task(naut_doc: NautDoc) -> List[NautToken]:
    honourifics = []
    for sentence in naut_doc.sentences:
        for token in sentence.tokens:
            if token.text.upper() in HONOURIFICS:
                honourifics.append(token)
    return honourifics
