from core.task.library.detect_obscure_acronyms_task import detect_obscure_acronyms_task
from core.task.test.task_parsing_helper import TaskParsingHelper

inputs = [
    "Worked on new NLP algorithm",
    "Used MLML to speed up engine"
]


def run_test():
    tph = TaskParsingHelper()
    for input in inputs:
        doc = tph.parse_document(input)
        res = detect_obscure_acronyms_task(doc)
        print(res)


if __name__ == "__main__":
    run_test()
