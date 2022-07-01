from __future__ import annotations

from collections import deque

from core.task.task import Task
from core.type.Type import Type


class TaskError(Exception):
    pass


class TaskExecutionError(Exception):
    pass


# DAG node that wraps a Task object
class Node:
    def __init__(self, name: str, task: Task, output_names: list[str]):
        self.name = name
        self.task = task
        self.input_param_mapping = {}  # maps (parent, output param) -> input param
        self.input_args = {}  # maps input arg name -> input arg
        self.output_names = output_names  # the names to give the output args
        self.named_outputs = {}  # maps output name -> output arg

        if len(output_names) != len(self.task.ordered_output_names):
            raise TaskError(
                f"length of node: {self.name} return values, does not match length of output values")

    def set_input_param_mapping(self, param_mapping: dict[tuple[str, str], str]):
        self.input_param_mapping = param_mapping

    def set_inputs(self, parent: str, args: dict[str, any], queue: deque[Node]):
        for param, arg in args.items():
            key = (parent, param)
            if key not in self.input_param_mapping:
                continue
            input_param_name = self.input_param_mapping[key]
            self.input_args[input_param_name] = arg

        # schedule this node if all dependencies satisfied
        if self._is_schedulable():
            queue.append(self)

    def set_user_inputs(self, user_inputs: dict[str, any], queue: deque[Node]):
        for input_arg_name, input_arg in user_inputs.items():
            input_arg_type = Type(str(type(input_arg)))

            # this node uses this input arg, so populate it
            # an assumption made is that user_input is not a nested list
            if input_arg_name in self.task.inputs and self.task.inputs[input_arg_name] == input_arg_type:
                self.input_args[input_arg_name] = input_arg
        if self._is_schedulable():
            queue.append(self)

    # a node is input_defined if input param mappings + injected user inputs = all input args for the task
    def all_inputs_defined(self):
        return len(self.input_args) + len(self.input_param_mapping) == len(self.task.inputs)

    def _is_schedulable(self):
        return len(self.task.inputs) == len(self.input_args)

    def _name_outputs(self, output_args: list[any]) -> dict[str, any]:
        assert (len(self.task.ordered_output_names) == len(output_args)), \
            "Task {} has an incorrect number of output_names for its output_args".format(self.name)
        for i in range(len(output_args)):
            self.named_outputs[self.output_names[i]] = output_args[i]
        return self.named_outputs

    def run(self) -> any:
        assert (self._is_schedulable()), "Task {} is not schedulable".format(self.name)
        outputs = self.task.func_def(**self.input_args)
        if not isinstance(outputs, tuple):
            outputs = [outputs]
        return self._name_outputs(outputs)
