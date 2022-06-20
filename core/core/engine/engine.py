from typing import List, Any

from core.converters.input.naut_parser import NautParser
from core.heuristics.heuristic import Resume


class EngineRequest:
    def __init__(self, document: str, heuristic="resume"):
        self.document = document
        self.heuristic = heuristic

class EngineResponse:
    def __init__(self, output: List[Any]):
        self.response = output

class Engine:
    def __init__(self, config):
        self.naut_parser = NautParser()
        self.heuristics = Resume()

    def handle_request(self, request: EngineRequest) -> EngineResponse:
        naut_doc = self.naut_parser.parse(request.document)
        return EngineResponse(self.heuristics.run(naut_doc))
