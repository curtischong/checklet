from core.task.library.shorten_months_task import shorten_months_task
from core.task.test.task_parsing_helper import TaskParsingHelper

inputs = [
    "Bob went to the farm in January",
    "Sally was born in may",
    "The cat jumped over the fall in OCTOBER"
]


def run_test():
    tph = TaskParsingHelper()
    for input in inputs:
        doc = tph.parse_document(input)
        res = shorten_months_task(doc)
        print(res)


if __name__ == "__main__":
    run_test()
