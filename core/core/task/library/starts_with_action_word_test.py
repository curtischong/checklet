from core.task.library.starts_with_action_word_task import starts_with_action_word_task
from core.task.test.task_parsing_helper import TaskParsingHelper

inputs = [
    "Bob went to the farm in January",
    "Created storage engine"
]


def run_test():
    tph = TaskParsingHelper()
    for input in inputs:
        doc = tph.parse_document(input)
        res = starts_with_action_word_task(doc)
        print(res)


if __name__ == "__main__":
    run_test()
