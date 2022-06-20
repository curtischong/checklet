from typing import List

from core.converters.tokenizer import Tokenizer
from core.heuristics.heuristic import Resume


class EngineRequest:
    def __init__(self, document: str, heuristic="resume"):
        self.document = document
        self.heuristic = heuristic


class Engine:
    def __init__(self, config):
        self.tokenizer = Tokenizer(config["tokenizer"])
        self.heuristics = Resume()

    def handle_request(self, request: EngineRequest) -> List[str]:
        naut_doc = self.tokenizer.tokenize(request.document)
        return self.heuristics.run(naut_doc)
