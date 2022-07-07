from collections import defaultdict, deque

import networkx as nx

from core.dag.node import Node, TaskError
from core.task.index import lambda_tasks, persistent_tasks
from core.type.Type import Type, TYPE_DICT

DEPENDENCIES = "dependencies"
PARAMS = "params"
NAME = "name"


class GraphStructureError(Exception):
    pass


class GraphExecutionError(Exception):
    pass


class DAG:
    def __init__(self, name: str, pipeline: dict[any, any]):
        self.name = name
        self.name_to_node: dict[str, Node] = {}  # map node name -> node
        self.edges: dict[Node, set[Node]] = defaultdict(set)  # map node -> children (set of nodes)
        self.parents = defaultdict(set)  # map node -> parents (set of nodes)
        self.roots: list[Node] = []
        self.leaves: list[Node] = []

        self._create_nodes(pipeline)
        self._create_edges(pipeline)
        self._parse_and_check_deps(pipeline)
        self._find_roots_and_leaves()
        self._inject_params(pipeline)
        if not self._is_acyclic():
            raise GraphStructureError(f"check {self.name} contains a cycle")

    def _inject_params(self, pipeline: dict[any, any]):
        # TODO: move pipeline to a separate class
        # so we can do: for task in pipeline.parameterized_tasks()
        for entry in pipeline:
            if PARAMS not in entry:
                continue

            params = entry["params"]
            name = entry["name"]
            if Type(str(type(params))) != TYPE_DICT:
                raise TaskError(f"params for task {name} is defined incorrectly, expecting a dict")
            self.name_to_node[name].set_params(params)
        return

    def _find_roots_and_leaves(self):
        for node in self.name_to_node.values():
            if node not in self.parents:
                self.roots.append(node)
            if not self.edges[node]:
                self.leaves.append(node)

    def _create_nodes(self, pipeline: dict[any, any]):
        # create nodes
        for entry in pipeline:
            if NAME not in entry:
                raise TaskError("tasks must be given a name!")
            name = entry[NAME]
            if name in self.name_to_node:
                raise GraphStructureError(f"node {name} is defined more than once")
            task = entry["task"]
            output_names = entry["outputs"]
            if task in lambda_tasks:
                self.name_to_node[name] = Node(name, lambda_tasks[task], output_names)
            elif task in persistent_tasks:
                self.name_to_node[name] = Node(name, persistent_tasks[task], output_names)
            else:
                raise TaskError(f"node: {name} uses undefined task: {task}")

    def _create_edges(self, pipeline: dict[any, any]):
        for entry in pipeline:
            node = self.name_to_node[entry["name"]]
            if DEPENDENCIES not in entry:
                continue
            deps = entry[DEPENDENCIES]

            for parent in deps:
                for parent_name in parent.keys():
                    if parent_name not in self.name_to_node:
                        raise GraphStructureError(f"node {parent_name} is not defined")
                    parent = self.name_to_node[parent_name]
                    self.edges[parent].add(node)
                    self.parents[node].add(parent)

    def _parse_and_check_deps(self, pipeline: dict[any, any]):
        for entry in pipeline:
            node = self.name_to_node[entry["name"]]
            if DEPENDENCIES not in entry:
                continue
            deps = entry[DEPENDENCIES]

            node_inputs = node.task.inputs  # maps input arg -> type
            node_input_param_mappings = {}  # maps (parent, parent arg output name) -> node arg input name
            for parent in deps:
                for parent_name, param_name_mapping in parent.items():
                    if parent_name not in self.name_to_node:
                        raise TaskError(f"node: {node.name} refers to parent: {parent_name} that does not exist")
                    parent = self.name_to_node[parent_name]

                    for parent_out_param, node_in_param in param_name_mapping.items():
                        if node_in_param not in node_inputs:
                            raise TaskError(f"task: {node.name} does not accept input arg: {node_in_param}")

                        # TODO: list lookup is linear
                        index = 0
                        try:
                            index = parent.output_names.index(parent_out_param)
                        except ValueError as _:
                            raise TaskError(
                                f"task: {node.name} refers to non-existent output arg: {parent_out_param} of parent: {parent_name}")

                        # match types
                        in_param_type = node_inputs[node_in_param]
                        out_param_type = parent.task.outputs[parent.task.ordered_output_names[index]]
                        if in_param_type != out_param_type:
                            raise TaskError(
                                f"node: {node.name} has type mismatch in dependency: {parent_out_param} for parent: {parent_name}")
                        node_input_param_mappings[(parent.name, parent_out_param)] = node_in_param
            node.set_input_param_mapping(node_input_param_mappings)

    def _is_acyclic(self) -> bool:
        graph = nx.DiGraph()
        for node in self.name_to_node.keys():
            graph.add_node(node)
        for node, adj_list in self.edges.items():
            for adj in adj_list:
                graph.add_edge(node, adj)
        return nx.is_directed_acyclic_graph(graph)

    def run(self, **kwargs: dict) -> list[Node]:
        queue: deque[Node] = deque()

        # dependency inject data to all nodes
        for node in self.name_to_node.values():
            node.set_user_inputs(kwargs, queue)
            if not node.all_inputs_defined():
                raise GraphStructureError(f"node {node.name} has unaccounted inputs")
        assert (len(queue) == len(self.roots))

        nodes_to_run = len(self.name_to_node)
        while queue:
            node = queue.popleft()
            nodes_to_run -= 1
            named_outputs = node.run()
            for child in self.edges[node]:
                child.set_analysis_inputs(node.name, named_outputs, queue)

        # assert that all graph nodes have been run
        assert (nodes_to_run == 0)
        return self.leaves
