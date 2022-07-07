from core.task.library.find_and_replace_task import find_and_replace_task
from core.task.test.task_parsing_helper import TaskParsingHelper

tph = TaskParsingHelper()
doc = tph.parse_document("this is our engine")
ans = find_and_replace_task(doc, "", [(["our engine", "this"], "the")])
print(ans)
