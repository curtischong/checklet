from lib.config import Tokenizer


class PersistentTaskTestTask:
    def __init__(self, config: Tokenizer):
        self.num = 3

    def process(self, a: int) -> int:
        return self.num + a
