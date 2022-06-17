from typing import List

from core.converters.tokenizer import Tokenizer


class EngineRequest:
    def __init__(self, document: str, heuristic="resume"):
        self.document = document
        self.heuristic = heuristic


class Engine:
    def __init__(self, config):
        self.tokenizer = Tokenizer(config["tokenizer"])
        self.heuristics = Heuristic()

    def handle_request(self, request: EngineRequest) -> List[str]:
        document = self.tokenizer.tokenize(request)
        # send to dag
