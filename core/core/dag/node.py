from __future__ import annotations

from collections import deque

from core.task.task import Task
from core.type.Type import Type


class NodeDefinitionError(Exception):
    pass


PARENT_NAME = str
PARENT_OUTPUT_NAME = str
NODE_INPUT_NAME = str
NODE_OUTPUT_NAME = str
TASK_OUTPUT_NAME = str


# DAG node that wraps a Task object
class Node:
    def __init__(self, name: str, task: Task, output_names: list[NODE_OUTPUT_NAME]):
        self.name = name
        self.task = task

        # maps (parent, output param name) -> input param name
        self.input_param_source: dict[tuple[PARENT_NAME, PARENT_OUTPUT_NAME], NODE_INPUT_NAME] = {}
        self.input_args: dict[NODE_INPUT_NAME, any] = {}  # maps param name -> arg

        self.output_vals: dict[NODE_OUTPUT_NAME, any] = {}  # the produced output, maps output name -> output arg
        num_outputs_produced = len(task.ordered_output_names)
        if len(output_names) != num_outputs_produced:
            # all outputs must be named
            raise NodeDefinitionError(
                f"{name} output mapping length: {len(output_names)} does not match expected: {num_outputs_produced}")
        # map new output param name -> orig output param name
        self.output_name_map: dict[NODE_OUTPUT_NAME, TASK_OUTPUT_NAME] = {output_names[i]: task.ordered_output_names[i]
                                                                          for i in range(len(output_names))}
        self.output_names = output_names

        # used to ensure that one input argument is not defined multiple times in the YAML
        self.unaccounted_inputs = set(task.inputs.keys())

    def add_param_mapping(self, parent: Node, param_mapping: dict[str, any]) -> None:
        # do the parameter re-mapping
        # out_name is the name of the parent output param
        # in_name is the name of the node input param
        for out_name, in_name in param_mapping.items():
            # the node must need the in_param
            if in_name not in self.unaccounted_inputs:
                raise NodeDefinitionError(
                    f"task {self.name}, arg {in_name} does not exist, or has already been defined")
            # the types must match
            try:
                out_type = parent.get_output_type(out_name)
                in_type = self.task.inputs[in_name]
                if out_type != in_type:
                    raise NodeDefinitionError(
                        f"task {self.name} input: {in_name} is of type: {in_type}, but output: {out_name} from task: {parent.name}, is type: {out_type}")
            except ValueError:
                raise NodeDefinitionError(
                    f"task {self.name} refers to non-existent param {out_name} of task {parent.name}")
            # do the remapping
            self.input_param_source[(parent.name, out_name)] = in_name
            self.unaccounted_inputs.remove(in_name)

    def get_output_type(self, output_param: str) -> Type:
        if output_param not in self.output_name_map:
            raise ValueError(f"task {self.task} does not produce {output_param}")
        return self.task.outputs[self.output_name_map[output_param]]

    def inject_param(self, key: str, val: str) -> None:
        if key not in self.unaccounted_inputs:
            raise NodeDefinitionError(f"task {self.name} does not accept {key}, or it has already been defined")
        self.input_args[key] = val
        self.unaccounted_inputs.remove(key)

    def inject_user_input(self, key: str, val: str, queue: deque[Node]) -> None:
        if key not in self.task.inputs:
            return
        self.input_args[key] = val
        self.unaccounted_inputs.remove(key)
        if self._is_schedulable():
            queue.append(self)

    def inject_runtime_input(self, parent: Node, inputs: dict[str, any], queue: deque[Node]) -> None:
        for arg_name, arg_val in inputs.items():
            key = (parent.name, arg_name)
            if key not in self.input_param_source:
                continue

            # assumption for type checking, the runtime input is not a nested list
            input_param_name = self.input_param_source[key]
            if input_param_name in self.task.inputs:
                self.input_args[input_param_name] = arg_val
        if self._is_schedulable():
            queue.append(self)

    def run(self) -> any:
        assert (self._is_schedulable()), f"Task {self.name} is not schedulable"
        outputs = self.task.func_def(**self.input_args)
        if not isinstance(outputs, tuple):
            outputs = [outputs]
        return self._name_outputs(outputs)

    def _is_schedulable(self):
        return len(self.task.inputs) == len(self.input_args)

    # a node is input_defined if input param mappings + injected user inputs = all input args for the task
    def get_unaccounted_inputs(self) -> set[str]:
        return self.unaccounted_inputs

    def _name_outputs(self, outputs: list[any]) -> dict[str, any]:
        assert (len(self.task.ordered_output_names) == len(outputs)), \
            f"Task {self.name} has an incorrect number of output_names for its output_args"
        self.output_vals = {self.output_names[i]: outputs[i] for i in range(len(outputs))}
        return self.output_vals
