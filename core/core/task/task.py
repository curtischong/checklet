import ast
import glob
import importlib
import inspect
from inspect import getmembers, isfunction, isclass
from os.path import dirname, basename, isfile, join
from typing import ClassVar, get_type_hints

# parsing constants
from type.Type import get_types, Type

DEPENDENCIES = "dependencies"


class InvalidTaskImplementationError(Exception):
    """invoked when the task implementation was implemented incorrectly"""
    pass


class Task:
    UNI_RETURN_VAR_NAME = "uni_return"

    def __init__(self, name: str, func_def: callable):
        self.func_def = func_def

        if name[-1] == "_":
            name = name[:-1]
        self.name = name

        self.inputs: dict[str, Type] = {}  # map of input_name -> input_type
        self.outputs: dict[str, Type] = {}  # map of output_name -> output_type
        self.ordered_output_names: list[str] = []  # ordered list of output names from function definition

        # parse input vars
        type_hints = get_type_hints(func_def)
        for var, type_hint in type_hints.items():
            if var == "return":
                continue
            self.inputs[var] = Type(str(type_hint))

        # parse output vars
        if "return" not in type_hints:
            raise InvalidTaskImplementationError(f"Task {self.name} does not have a return type annotation")
        return_types = get_types(str(type_hints["return"]))
        self._init_outputs(return_types, func_def)

        self.is_feedback_task = True if return_types == [Type("Feedback")] else False

    def _init_outputs(self, return_types: list[Type], func_def: callable):
        if len(return_types) == 1:
            # functions with only one return value have a special name
            self.outputs[self.UNI_RETURN_VAR_NAME] = return_types[0]
            self.ordered_output_names.append(self.UNI_RETURN_VAR_NAME)
            return
        return_names = self._get_return_names(func_def, len(return_types))
        for i in range(len(return_types)):
            self.outputs[return_names[i]] = return_types[i]
            self.ordered_output_names.append(return_names[i])

    def _get_return_names(self, func_def: callable, num_return_vals: int) -> list[str]:
        (tree,) = ast.parse(inspect.getsource(func_def)).body

        return_statements = [
            node for node in ast.walk(tree) if isinstance(node, (ast.Return,))
        ]

        # https://stackoverflow.com/a/48366253/4647924
        def get_ids(elt):
            """Extract identifiers if present. If not return None"""
            if isinstance(elt, (ast.Tuple,)):
                # For tuple get id of each item if item is a Name
                return [x.id for x in elt.elts if isinstance(x, ast.Name)]
            if isinstance(elt, ast.Name):
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
def parse_tasks() -> tuple[dict[str, Task], dict[str, PersistentTask]]:
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


if __name__ == "__main__":
    parse_tasks()
