from typing import List

import yaml


class Tokenizer:
    def __init__(self, config: str):
        with open(config["model_location"], 'r') as stream:
            data = yaml.safe_load(stream)
            self.tokenizer = data["spacy_model"]

    def tokenize(self, doc: str) -> List[str]:
        return self.tokenizer(doc)
