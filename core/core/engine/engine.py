from typing import List

from core.converters.naut_parser import NautParser
from core.heuristics.heuristic import Resume


class EngineRequest:
    def __init__(self, document: str, heuristic="resume"):
        self.document = document
        self.heuristic = heuristic


class Engine:
    def __init__(self, config):
        self.naut_parser = NautParser()
        self.heuristics = Resume()

    def handle_request(self, request: EngineRequest) -> List[str]:
        naut_doc = self.naut_parser.parse(request.document)
        return self.heuristics.run(naut_doc)
