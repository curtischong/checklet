import glob
import os
import traceback
from abc import ABC
from copy import deepcopy

from core.converters.input.naut_parser import NautDoc
from core.dag.dag import DAG
from core.dag.node import Node
from core.heuristics.feedback import Feedback, FeedbackGenerator
from core.heuristics.pipeline import CheckDef
from core.lib.corpus.action_verbs import ActionVerbs
from core.lib.models.naut_embeddings import NautEmbeddings


class CheckDefinitionError(BaseException):
    pass


class Check:
    def __init__(self, check_path: str):
        self.name = check_path
        self.check_def = CheckDef(check_path)
        self.template_dag = DAG(check_path, self.check_def.pipeline_def)
        self.template_feedback_generator = FeedbackGenerator(self.check_def.feedback_def)
        self._validate()

    def _validate(self):
        # validate that feedback uses variables that are defined in the pipeline
        feedback_vars = {x for x in [self.template_feedback_generator.src_naut_tokens_var_name,
                                     self.template_feedback_generator.src_naut_sentences_var_name,
                                     self.template_feedback_generator.src_naut_tokens_on_select_var_name] if
                         x is not None}
        leaf_outputs = {output for leaf in self.template_dag.get_nodes() for output in leaf.output_names}
        if not leaf_outputs.issuperset(feedback_vars):
            raise CheckDefinitionError(
                f"feedback {self.name} uses variables {feedback_vars.difference(leaf_outputs)} not produced by pipeline")

    def run(self, data: dict[str, any]) -> list[Feedback]:
        dag = deepcopy(self.template_dag)
        nodes_ran = dag.run(data)
        return self.gen_feedback(nodes_ran)

    def gen_feedback(self, nodes_ran: list[Node]) -> list[Feedback]:
        feedback_generator = deepcopy(self.template_feedback_generator)
        return feedback_generator.run(nodes_ran)


class Heuristic(ABC):
    def __init__(self, name: str):
        self.name = name
        self.config_root = os.path.dirname(__file__)
        self.checks = self.parse_checks()

    def parse_checks(self) -> list[Check]:
        checks = []
        for check_path in glob.glob(f"{self.config_root}/{self.name}/checks/*.yaml", recursive=True):
            checks.append(Check(check_path))
        return checks
    # TODO: do automated testing on the testcases


class Resume(Heuristic):
    def __init__(self, naut_embeddings: NautEmbeddings, action_verbs: ActionVerbs):
        self.naut_embeddings = naut_embeddings
        self.action_verbs = action_verbs
        super().__init__("resume")

    def run(self, doc: NautDoc) -> list[Feedback]:
        all_feedback = []
        # TODO: add concurrency, and stream results eagerly
        for check in self.checks:
            try:
                check_feedback = check.run({
                    "naut_doc": doc,
                    "naut_embeddings": self.naut_embeddings,
                    "action_verbs": self.action_verbs
                })
                for feedback in check_feedback:
                    all_feedback.append(feedback)
            except Exception as e:
                print(e)
                traceback.print_exc()
        return all_feedback
