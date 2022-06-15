from typing import List

from core.converters.tokenizer import Tokenizer


class Engine:
    def __init__(self, config):
        self.tokenizer = Tokenizer(config["tokenizer"])

    def analyze(config_path: str, tokens: List[str]) -> List[str]:
        return []
