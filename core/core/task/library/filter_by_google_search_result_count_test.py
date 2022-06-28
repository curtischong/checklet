from core.task.library.filter_by_google_search_result_count import filter_by_google_search_result_count_task
from core.task.test.task_parsing_helper import TaskParsingHelper

inputs = [
    "user creation generation",
    "benchmark testing suite",
]


def run_test():
    tph = TaskParsingHelper()
    for input in inputs:
        tokens = tph.to_naut_tokens(input)
        ans = filter_by_google_search_result_count_task([tokens])
        print(ans)


if __name__ == "__main__":
    run_test()
