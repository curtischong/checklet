from core.converters.input.naut_parser import NautParser
from core.heuristics.feedback import Feedback
from core.heuristics.heuristic import Resume
from core.task.test.task_parsing_helper import TaskParsingHelper


class EngineRequest:
    def __init__(self, document: str, heuristic="resume"):
        self.document = document
        self.heuristic = heuristic


class EngineResponse:
    def __init__(self, feedback: list[Feedback]):
        self.response = feedback


class Engine:
    def __init__(self, config, use_task_parsing_helper=False):
        if use_task_parsing_helper:
            tph = TaskParsingHelper()
            self.naut_parser = tph.naut_parser
        else:
            self.naut_parser = NautParser()
        self.heuristics = Resume()

    def handle_request(self, request: EngineRequest) -> EngineResponse:
        naut_doc = self.naut_parser.parse(request.document)
        return EngineResponse(self.heuristics.run(naut_doc))
