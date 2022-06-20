import glob
import os
from abc import ABC
from typing import List, Mapping

import yaml
from core.converters.tokenizer import NautDoc
from core.dag.node import Node
from core.dag.dag import DAG


class Check:
    def __init__(self, check_path: str):
        self.name = check_path
        with open(check_path, 'r') as stream:
            config = yaml.safe_load(stream)

        pipeline = config["Pipeline"]
        self.dag = DAG(self.name, pipeline)

    def run(self, data: Mapping[str, any]) -> List[Node]:
        return self.dag.run(**data)


class Heuristic(ABC):
    def __init__(self, name: str):
        self.name = name
        self.config_root = os.path.dirname(__file__)
        self.checks = self.parse_checks()

    def parse_checks(self) -> List[Check]:
        checks = []
        for check_path in glob.glob(f"{self.config_root}/**/blueprint.yaml", recursive=True):
            checks.append(Check(check_path))
        return checks
    # TODO: do automated testing on the testcases


class Resume(Heuristic):
    def __init__(self):
        super().__init__("resume")

    def run(self, doc: NautDoc) -> List[str]:
        suggestions = []
        # TODO: execute concurrently, stream results eagerly to client
        for check in self.checks:
            leaves = check.run({
                "naut_doc": doc
            })
            suggestions.extend([leaf.output for leaf in leaves])
        return suggestions
