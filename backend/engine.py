from backend.check import Check


class Engine:
    def __init__(self):
        pass

    def generate_feedback(self):
        pass

    def checkDoc(self, document:str, check: Check):
        # todo: feed prompt to llm
        # TODO: put this systemPrompt in the check class
        print(system_prompt)