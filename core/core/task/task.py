import ast
import glob
import importlib
import inspect
from inspect import getmembers, isfunction, isclass
from os.path import dirname, basename, isfile, join
from typing import List, Mapping, Callable, ClassVar, get_type_hints, Tuple

# parsing constants
DEPENDENCIES = "dependencies"


class InvalidTaskImplementationError(Exception):
    """invoked when the task implementation was implemented incorrectly"""
    pass


# TODO: add a method to return the semantic type of a type (ie. not typing.List[int], but just List[int])
class Task:
    UNI_RETURN_VAR_NAME = "uni_return"

    def __init__(self, name: str, func_def: Callable):
        self.func_def = func_def

        self.is_lambda_task = False
        if name[-1] == "_":
            # this task can be run as a function
            self.is_lambda_task = True
            name = name[:-1]
        self.name = name

        self.inputs: Mapping[str, str] = {}  # map of input_name -> input_type
        self.outputs: Mapping[str, str] = {}  # map of output_name -> output_type
        self.output_names: List[str] = []  # ordered list of output names from function definition

        # parse input vars
        type_hints = get_type_hints(func_def)
        for var, var_type in type_hints.items():
            if var == "return":
                continue
            var_type_str = str(var_type)
            self.inputs[var] = var_type_str.replace("typing.", "")

        # parse output vars
        return_types = self._get_return_types(str(type_hints["return"]))
        self._init_outputs(return_types, func_def)

        self.is_feedback_task = True if return_types == ["Feedback"] else False

    def _init_outputs(self, return_types: List[str], func_def: Callable):
        if len(return_types) == 1:
            # this function only returns one variable. This variable has a default name
            self.outputs[self.UNI_RETURN_VAR_NAME] = return_types[0]
            self.output_names.append(self.UNI_RETURN_VAR_NAME)
            return
        return_names = self._get_return_names(func_def, len(return_types))
        for i in range(len(return_types)):
            self.outputs[return_names[i]] = return_types[i]
            self.output_names.append(return_names[i])

    # since return types are always tuples, we need to extract
    # the individual return types in each idx of the tuple.
    # since there is no built-in function to do this, I wrote
    # this function that parses the string of the tuple to accomplish this
    def _get_return_types(self, s: str) -> List[str]:
        s = s.replace("typing.", "")
        s = s.replace(" ", "")
        if not s.startswith("Tuple"):
            return [s]
        n = len(s)
        # if there are nested tuples, we use this variable
        # to know if we are in the outermost tuple
        rbrackets_remaining = 0
        ans = []
        last_var_start = 0
        for i in range(n):
            cur = s[i]
            if cur == "[":
                if rbrackets_remaining == 0:
                    last_var_start = i + 1
                rbrackets_remaining += 1
            elif cur == "]":
                rbrackets_remaining -= 1
                if rbrackets_remaining == 0:
                    # we are finished parsing
                    ans.append(s[last_var_start: i])
                    return ans
            elif cur == ",":
                if rbrackets_remaining == 1:
                    ans.append(s[last_var_start:i])
                    last_var_start = i + 1
        raise RuntimeError("this code should never be reached. we are improperly parsing the function return types")

    assert _get_return_types(None, "int") == ["int"]
    assert _get_return_types(None, "typing.Tuple[typing.List[int], int]") == ["List[int]", "int"]
    assert _get_return_types(None, "Tuple[Tuple[int, str], int]") == ["Tuple[int,str]", "int"]

    def _get_return_names(self, func_def: Callable, num_return_vals: int) -> List[str]:
        (tree,) = ast.parse(inspect.getsource(func_def)).body

        return_statements = [
            node for node in ast.walk(tree) if isinstance(node, (ast.Return,))
        ]

        # https://stackoverflow.com/a/48366253/4647924
        def get_ids(elt):
            """Extract identifiers if present. If not return None"""
            if isinstance(elt, (ast.Tuple,)):
                # For tuple get id of each item if item is a Name
                return [x.id for x in elt.elts if isinstance(x, (ast.Name,))]
            if isinstance(elt, (ast.Name,)):
                return [elt.id]

        return_names = [get_ids(r.value) for r in return_statements]
        # we are only concerned with the return names from the first index
        # note: this may fail if the function has early returns and those early returns
        # aren't passing variable names

        for name in return_names:
            if len(name) == num_return_vals:
                return name
        raise InvalidTaskImplementationError(
            "{} needs a return line where all of the values that are returned have a variable name. These variable"
            "names helps the task parser understand which outputs correspond to which output variable name. E.g. "
            "GOOD: return trimmed_string, old_str_len BAD: return str.trim(), len(str)".format(self.name))


class PersistentTask(Task):
    def __init__(self, name: str, class_def: ClassVar):
        process_func = getattr(class_def, "process")
        super().__init__(name, process_func)
        init_func = getattr(class_def, "__init__")
        init_func_type_hints = get_type_hints(init_func)
        self.load = {}
        for var, var_type in init_func_type_hints.items():
            if var == "return":
                continue
            self.load[var] = str(var_type)


# returns two maps: (task_name -> Task) and (task_name -> PersistentTask)
def parse_tasks() -> Tuple[Mapping[str, Task], Mapping[str, PersistentTask]]:
    task_directory = join(dirname(__file__), "library", "*.py")
    task_modules = []

    # auto-import all checks, so they're in the namespace
    for f in glob.glob(task_directory):
        if not isfile(f):
            continue
        task_modules.append("core.task.library." + basename(f)[:-3])
    tasks = {}
    persistent_tasks = {}
    for task_module in task_modules:
        module = importlib.import_module(task_module)
        for func_name, member in getmembers(module):
            if func_name[-4:].lower() != "task":
                continue
            task_name = func_name[:-4]
            if isfunction(member):
                tasks[task_name] = Task(task_name, member)
            elif isclass(member):
                persistent_tasks[task_name] = PersistentTask(task_name, member)
    return tasks, persistent_tasks
