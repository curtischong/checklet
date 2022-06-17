# import lib.config as Config
# from core.converters.tokenizer import Tokenizer

# TODO: cleanup
# tokenizer_config = Config.Tokenizer({"model_location": "en_core_web_sm"})
# tokenizer = Tokenizer(tokenizer_config)
# document = tokenizer.tokenize("this is our sentence")

# signature = inspect.signature(locate_first_person_pronouns_task)
# task_name = locate_first_person_pronouns_task.__name__


# print(locals()[task_name](document))


# for param in signature.parameters.values():
#    print(param.name, str(param.annotation))

# class TaskOutput:
#    def __init__(self, ):

from tasks import parse_tasks

tasks = parse_tasks()
print(tasks)
