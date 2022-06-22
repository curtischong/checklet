import glob
import os
from abc import ABC
from typing import Any, List, Mapping

import yaml
from core.converters.input.naut_parser import NautDoc
from core.dag.node import Node
from core.dag.dag import DAG

from core.heuristics.feedback import FeedbackGenerator, Feedback

class Check:
    def __init__(self, check_path: str):
        self.name = check_path
        with open(check_path, 'r') as stream:
            config = yaml.safe_load(stream)

        pipeline = config["Pipeline"]
        feedback_template = config["Feedback"]
        self.dag = DAG(self.name, pipeline)
        self.feedback_generator = FeedbackGenerator(self.name, feedback_template)
        self.feedback = []

    def gen_feedback(self, computed_leaves: List[Node]) -> List[Feedback]:
        self.feedback = self.feedback_generator.run(computed_leaves)
        return self.feedback

    def run(self, data: Mapping[str, Any]) -> List[Feedback]:
        leaves = self.dag.run(**data)
        return self.gen_feedback(leaves)


class Heuristic(ABC):
    def __init__(self, name: str):
        self.name = name
        self.config_root = os.path.dirname(__file__)
        self.checks = self.parse_checks()

    def parse_checks(self) -> List[Check]:
        checks = []
        for check_path in glob.glob(f"{self.config_root}/{self.name}/checks/*.yaml", recursive=True):
            checks.append(Check(check_path))
        return checks
    # TODO: do automated testing on the testcases


class Resume(Heuristic):
    def __init__(self):
        super().__init__("resume")

    def run(self, doc: NautDoc) -> List[Feedback]:
        all_feedback = []
        # TODO: execute concurrently, stream results eagerly to client
        for check in self.checks:
            check_feedback = check.run({
                "naut_doc": doc
            })
            for feedback in check_feedback:
                all_feedback.append(feedback)
        return all_feedback
