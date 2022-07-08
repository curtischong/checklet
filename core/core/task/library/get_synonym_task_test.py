from core.task.library.get_synonym_task import get_synonym_task
from core.task.test.task_parsing_helper import TaskParsingHelper

def run_test():
    tph = TaskParsingHelper()
    doc = tph.parse_document("designed and implemented")
    naut_embeddings = tph.naut_embeddings
    synonyms = get_synonym_task([doc.tokens], naut_embeddings)
    print(synonyms)

if __name__ == "__main__":
    run_test()