from typing import List

import spacy
from spacy.tokens import Doc, Token

from core.lib import config


class NautToken:
    def __init__(self, token: Token):
        self.token = token

    def __repr__(self):
        return str(self.token)


# TODO: consider inheritance from spacy docs
class NautDoc:
    def __init__(self, doc: Doc):
        self.doc = doc

    def tokens(self) -> List[NautToken]:
        tokens = []
        for token in self.doc.__iter__():
            tokens.append(NautToken(token))
        return tokens


class Tokenizer:
    def __init__(self, tokenizer_config: config.Tokenizer):
        self.tokenizer = spacy.load(tokenizer_config.model_location)

    def tokenize(self, document: str) -> NautDoc:
        doc = self.tokenizer.make_doc(document)
        return NautDoc(doc)
