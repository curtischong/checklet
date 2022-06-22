from __future__ import annotations

from collections import deque
from typing import Mapping, Tuple, List, Any

from core.task.task import Task

# TODO: put this static mapping in a typing class
user_input_mapping = {
    "naut_doc": "<class \'core.converters.naut_parser.NautDoc\'>",
}


class TaskError(Exception):
    pass


# DAG node that wraps a Task object
class Node:
    def __init__(self, name: str, task: Task, outputs: List[str]):
        self.input_param_mapping = {}  # maps parent, output var -> input param
        self.name = name
        self.task = task
        self.input_args = {}  # maps input arg name -> input arg
        self.output_names = outputs
        self.named_outputs = {}

    def set_input_param_mapping(self, param_mapping: Mapping[Tuple[str, str], str]):
        self.input_param_mapping = param_mapping

    def set_inputs(self, parent: str, args: Mapping[str, Any], queue: deque[Node]):
        for param, arg in args.items():
            key = (parent, param)
            if key not in self.input_param_mapping:
                continue

            input_param_name = self.input_param_mapping[key]
            # TODO: need to standardize the type strings
            # expected_param_type = self.task.inputs[input_param_name]
            # if expected_param_type != type(arg):
            #     raise GraphExecutionError(
            #         f"expected param: {param} of node {self.name} to be of type: {expected_param_type}, received: {type(input)}")
            self.input_args[input_param_name] = arg

        # schedule this node if all dependencies satisfied
        if self._is_schedulable():
            queue.append(self)

    def set_user_inputs(self, user_inputs: Mapping[str, Any], queue: deque[Node]):
        for input_arg_name, input_arg in user_inputs.items():
            input_arg_type = str(type(input_arg))

            # this node uses this user input arg
            # TODO: type name needs to be standardized
            if input_arg_name in self.task.inputs and self.task.inputs[input_arg_name] == input_arg_type:
                self.input_args[input_arg_name] = input_arg
        if self._is_schedulable():
            queue.append(self)

    # a node is input_defined if the combination of user inputs and input param mappings of parent node outputs
    # capture all input arguments of self.task
    def all_inputs_defined(self):
        return len(self.input_args) + len(self.input_param_mapping) == len(self.task.inputs)

    def _is_schedulable(self):
        return len(self.task.inputs) == len(self.input_args)

    def _name_outputs(self, output_args: List[Any]) -> Mapping[str, Any]:
        if len(self.task.output_names) != len(output_args):
            raise TaskError(
                f"length of node: {self.name} return values, does not match length of output values")
        for i in range(len(output_args)):
            self.named_outputs[self.output_names[i]] = output_args[i]
        return self.named_outputs

    def run(self) -> Any:
        assert(self._is_schedulable())
        outputs = self.task.func_def(**self.input_args)
        return self._name_outputs([outputs])
