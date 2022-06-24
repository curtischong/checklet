from core.converters.input.naut_parser import NautParser
from core.task.library.detect_honourifics_task import detect_honourifics_task

inputs = [
    "Honours Bachelor of Software Engineering",
    "Honors Bachelor of Computer Science",
    "Bachelor of Applied Science Honours",
    "Bachelor of Nautilus"
]

def run_test():
    for input in inputs:
        doc = NautParser().parse(input)
        res = detect_honourifics_task(doc)
        print(res)

if __name__ == "__main__":
    run_test()