import copy
from collections import defaultdict, deque
from typing import Mapping, List

import networkx as nx
from typing import Any

from core.dag.node import Node, TaskError
from core.task.index import lambda_tasks, persistent_tasks

# parsing constants
DEPENDENCIES = "dependencies"


class GraphStructureError(Exception):
    pass


class GraphExecutionError(Exception):
    pass


class DAG:
    def __init__(self, check: str, pipeline: Mapping[Any, Any]):
        self.check = check
        self.name_to_node: Mapping[str, Node] = {}  # map from node name -> node
        self.edges: Mapping[Node, set[Node]] = defaultdict(set)  # map node -> edges (set of nodes)
        self.parents = defaultdict(set)  # map node -> parents (set of nodes)
        self.roots: List[Node] = []

        self._create_nodes(pipeline)
        self._create_edges(pipeline)
        self._parse_and_check_deps(pipeline)
        self._find_roots()
        if not self._is_acyclic():
            raise GraphStructureError(f"check {self.check} contains a cycle")

    def _find_roots(self):
        for node in self.name_to_node.values():
            if node not in self.parents:
                self.roots.append(node)

    def _create_nodes(self, pipeline: Mapping[Any, Any]):
        # create nodes
        for entry in pipeline:
            name = entry["name"]
            if name in self.name_to_node:
                raise GraphStructureError(f"node {name} is defined more than once")
            task = entry["task"]
            if task in lambda_tasks:
                self.name_to_node[name] = Node(name, lambda_tasks[task])
            elif task in persistent_tasks:
                self.name_to_node[name] = Node(name, persistent_tasks[task])
            else:
                raise TaskError(f"task {name} is not defined")

    def _create_edges(self, pipeline: Mapping[Any, Any]):
        for entry in pipeline:
            node = self.name_to_node[entry["name"]]
            if DEPENDENCIES not in entry:
                continue
            deps = entry[DEPENDENCIES]

            for dep in deps:
                for p_name in dep.keys():
                    parent = self.name_to_node[p_name]
                    self.edges[parent].add(node)
                    self.parents[node].add(parent)

    def _parse_and_check_deps(self, pipeline: Mapping[Any, Any]):
        for entry in pipeline:
            node = self.name_to_node[entry["name"]]
            if DEPENDENCIES not in entry:
                continue
            deps = entry[DEPENDENCIES]

            node_inputs = copy.deepcopy(node.task.inputs)  # input arg -> type
            node_input_param_mappings = {}  # (parent, parent arg output name) -> node arg input name
            for dep in deps:
                for parent_name, param_name_mapping in dep.items():
                    parent = self.name_to_node[parent_name]
                    for parent_out_param, node_in_param in param_name_mapping.items():
                        if node_in_param not in node_inputs:
                            raise TaskError(f"task: {node.name} does not accept input arg: {node_in_param}")

                        in_param_type = node_inputs[node_in_param]
                        out_param_type = parent.task.outputs[parent_out_param]
                        if in_param_type != out_param_type:
                            raise TaskError(
                                f"node: {node.name} expects input parameter: {node_in_param} of type: {in_param_type}, got: {out_param_type}")
                        node_inputs.pop(node_in_param)
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

    def _is_leaf(self, n: Node) -> bool:
        return not self.edges[n]

    def run(self, **kwargs) -> List[Node]:
        queue: deque[Node] = deque()

        # dependency inject data to all nodes
        for node in self.name_to_node.values():
            node.set_user_inputs(kwargs, queue)

        # all roots should have dependencies satisfied
        if len(queue) != len(self.roots):
            roots = set(self.roots)
            roots.difference([n for n in queue])
            raise GraphStructureError(f"roots: {str(roots)} missing values")

        # TODO: leaves can be precomputed
        leaves = []
        while queue:
            node = queue.popleft()
            named_outputs = node.run()
            if self._is_leaf(node):
                leaves.append(node)
            for child in self.edges[node]:
                child.set_inputs(node.name, named_outputs, queue)
        return leaves
