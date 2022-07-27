from core.converters.input.naut_parser import NautParser
from core.heuristics.feedback import Feedback
from core.heuristics.heuristic import Resume
from core.lib.corpus.action_verbs import ActionVerbs
from core.lib.models.naut_embeddings import NautEmbeddings
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
            self.naut_embeddings = tph.naut_embeddings
            self.action_verbs = tph.action_verbs
        else:
            self.naut_parser = NautParser()
            self.naut_embeddings = NautEmbeddings()
            self.action_verbs = ActionVerbs()
        self.heuristics = Resume(self.naut_embeddings, self.action_verbs)

    def handle_request(self, request: EngineRequest) -> EngineResponse:
        naut_doc = self.naut_parser.parse(request.document)
        return EngineResponse(self.heuristics.run(naut_doc))
