import spacy
from config import Config


class Parser:
    def __init__(self, config: Config):
        self.model = spacy.load(config.spacy_model)

    def parse(self, document):
        return self.model(document)
