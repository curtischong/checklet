from core.task.library.extract_contrived_noun_phrases_task import extract_contrived_noun_phrases_task
from core.task.test.task_parsing_helper import TaskParsingHelper

inputs = [
    "Optimized user creation generation using ASP.Net and React, reducing wait time by 80%.",
    "user creation generation randomizer",
    "Selected our storage engine by creating our benchmark testing suite tracking latency and memory per operation, as well as total disk usage for various key value stores.",
]


def run_test():
    tph = TaskParsingHelper()
    for input in inputs:
        doc = tph.parse_document(input)
        res = extract_contrived_noun_phrases_task(doc)
        print(res)


if __name__ == "__main__":
    run_test()
