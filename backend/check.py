
from backend.llm import Llm
from openai.types.chat import ChatCompletionUserMessageParam


class PositiveExample:
    def __init__(self, originalText:str, editedText:str):
       self.originalText = originalText
       self.editedText = editedText

    def __str__(self):
        return f"Original Text: {self.originalText}\nEdited Text: {self.editedText}"

class Check:
    def __init__(self, name:str, instruction:str, long_desc:str, category:str, positive_examples:list[PositiveExample]):
        self.name = name
        self.instruction = instruction
        self.long_desc = long_desc
        self.category = category
        self.positive_examples = positive_examples
        self.llm = Llm(system_prompt=self.get_system_prompt(), use_cache=True)
        
    def get_system_prompt(self):
        positive_examples = "\n".join([str(check) for check in self.positive_examples])

        return f"""You are a text document fixer. {self.instruction}

Do not repeat back the entire text. Only output the edited text plus a bit of context around the edit for context. Here are some positive examples:

{positive_examples}
"""

    def check_doc(self, doc):
        prompt:ChatCompletionUserMessageParam = {
            'role': 'user',
            'content': doc
        }
        response = self.llm.prompt(prompt)
        return response.choices[0].text