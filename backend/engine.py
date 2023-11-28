from backend.check import Check
import os, json

from backend.checker import Checker


class Engine:
    def __init__(self):
        self.checkers = []

    def generate_feedback(self):
        pass

    def import_checkers(self):
        checkers_dir = './checkers/'
        for filename in os.listdir(checkers_dir):
            if filename.endswith('.json'):
                checker_path = os.path.join(checkers_dir, filename)
                checker = Checker(checker_path)


    def checkDoc(self, document:str, check: Check):
        # todo: feed prompt to llm
        # TODO: put this systemPrompt in the check class
        print(system_prompt)