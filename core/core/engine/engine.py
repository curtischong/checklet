from typing import List

from core.converters.tokenizer import Tokenizer
from core.heuristics.heuristic import Heuristic


class EngineRequest:
    def __init__(self, document: str, heuristic="resume"):
        self.document = document
        self.heuristic = heuristic


class Engine:
    def __init__(self, config):
        self.tokenizer = Tokenizer(config["tokenizer"])
        self.heuristics = Heuristic("resume")

    def handle_request(self, request: EngineRequest) -> List[str]:
        document = self.tokenizer.tokenize(request.document)
        # send to dag
        token_strs = []
        for token in document.tokens():
            token_strs.append(repr(token))
        return token_strs
