from core.task.library.use_specific_numbers_task import use_specific_numbers_task
from core.task.test.task_parsing_helper import TaskParsingHelper

inputs = [
    "Optimized many user queries",
    "Worked with many people on designing an architecture",
]


def run_test():
    tph = TaskParsingHelper()
    for input in inputs:
        doc = tph.parse_document(input)
        res = use_specific_numbers_task(doc)
        print(res)


if __name__ == "__main__":
    run_test()
