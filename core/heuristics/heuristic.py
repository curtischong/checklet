import glob
from abc import ABC
from typing import List

import yaml


class Check:
    def __init__(self, check_path: str):
        self.name = check_path
        with open(check_path, 'r') as stream:
            config = yaml.safe_load(stream)

        pipeline = config["pipeline"]
        tasks = []
        for task in pipeline:
            tasks.append(Task(task))


class Heuristic(ABC):
    def __init__(self, name: str):
        self.name = name
        self.starting_nodes: List[Task] = []

        self.checks = self.parse_checks(name)

    def parse_checks(self, config_dir: str) -> List[Check]:
        checks = []
        for check_path in glob.glob(config_dir):
            checks.append(Check(check_path))
        return checks

    def starting_tasks(self):
        pass
    # TODO: do automated testing on the testcases


class Resume(Heuristic):
    def __init__(self):
        super().__init__("resume")
