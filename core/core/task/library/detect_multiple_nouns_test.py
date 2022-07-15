from core.task.library.detect_multiple_nouns_task import detect_multiple_nouns_task
from core.task.test.task_parsing_helper import TaskParsingHelper

inputs = [
    "Developed generic ML pipeline interface, enabling major codebase refactor to 5+ different pipelines, allowing for easier readability and maintainability of current pipeline architectures",
    "Used MLML to speed up engine"
]


def run_test():
    tph = TaskParsingHelper()
    for input in inputs:
        doc = tph.parse_document(input)
        res = detect_multiple_nouns_task(doc)
        print(res)


if __name__ == "__main__":
    run_test()
