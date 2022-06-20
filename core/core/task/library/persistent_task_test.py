class PersistentTaskTestTask:
    def __init__(self):
        self.num = 3

    def process(self, a: int) -> int:
        return self.num + a
