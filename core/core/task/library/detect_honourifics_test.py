from core.task.library.detect_honourifics_task import detect_honourifics_task
from core.task.test.task_parsing_helper import TaskParsingHelper

inputs = [
    "Honours Bachelor of Software Engineering",
    "Honors Bachelor of Computer Science",
    "Bachelor of Applied Science Honours",
    "Bachelor of Nautilus"
]


def run_test():
    tph = TaskParsingHelper()
    for input in inputs:
        doc = tph.parse_document(input)
        res = detect_honourifics_task(doc)
        print(res)


if __name__ == "__main__":
    run_test()
