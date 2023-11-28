import json

class Checker:
    def __init__(self, checker_path:str) -> None:
        with open(checker_path, 'r') as f:
            checker_data = json.load(f)
            self.name = checker_data["name"]
            for check in checker_data["checks"]:
