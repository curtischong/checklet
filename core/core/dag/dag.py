from collections import defaultdict, deque

import networkx as nx

from core.dag.node import Node
from core.heuristics.pipeline import PipelineDefinition
from core.task.index import lambda_tasks, persistent_tasks


class GraphStructureError(Exception):
    pass


class GraphExecutionError(Exception):
    pass


NODE_NAME = str


class DAG:
    def __init__(self, name: str, pipeline: PipelineDefinition):
        self.name = name
        self.pipeline = pipeline

        self.name_to_node: dict[NODE_NAME, Node] = {}  # map node name -> node
        self.children: dict[Node, set[Node]] = defaultdict(set)  # map node -> children

        # two pass algorithm to handle use before definition
        self._pass_one(pipeline)
        self._pass_two(pipeline)
        self._validate()

    def run(self, user_inputs: dict[any, any]) -> set[Node]:
        queue: deque[Node] = deque()
        self._inject_user_inputs(user_inputs, queue)
        for node in self.name_to_node.values():
            missing_inputs = node.get_unaccounted_inputs()
            assert not missing_inputs, f"DAG {self.name}, node {node.name} has unaccounted inputs {missing_inputs}"

        nodes_ran: set[Node] = set()
        while queue:
            node = queue.popleft()
            named_outputs = node.run()
            nodes_ran.add(node)
            for child in self.children[node]:
                child.inject_runtime_input(node, named_outputs, queue)
        assert len(nodes_ran) == len(self.name_to_node), \
            f"DAG {self.name} did not run nodes {set(self.name_to_node.values()).difference(n.name for n in nodes_ran)}"
        return nodes_ran

    def get_nodes(self) -> set[Node]:
        return set(self.name_to_node.values())

    def _pass_one(self, pipeline: PipelineDefinition) -> None:
        # create the nodes
        for pipeline_entry in pipeline.entries:
            entry_name = pipeline_entry.name
            if entry_name in self.name_to_node:
                raise GraphStructureError(f"node {entry_name} is defined more than once")
            entry_task = pipeline_entry.task
            task_func = lambda_tasks.get(entry_task, persistent_tasks.get(entry_task))
            if not task_func:
                raise GraphStructureError(f"task {entry_task} has no implementation")
            self.name_to_node[entry_name] = Node(entry_name, task_func, pipeline_entry.outputs)

    def _pass_two(self, pipeline: PipelineDefinition) -> None:
        # process node relationships
        for pipeline_entry in pipeline.entries:
            entry_name = pipeline_entry.name
            node = self.name_to_node[entry_name]
            self._process_deps(node, pipeline_entry.dependencies)
            self._inject_params(node, pipeline_entry.params)

    def _validate(self) -> None:
        def is_acyclic() -> bool:
            graph = nx.DiGraph()
            for node in self.name_to_node.keys():
                graph.add_node(node)
            for node, adj_list in self.children.items():
                for adj in adj_list:
                    graph.add_edge(node, adj)
            return nx.is_directed_acyclic_graph(graph)

        if not is_acyclic():
            raise GraphStructureError(f"{self.name} is not acyclic!")

    def _process_deps(self, node: Node, deps: list[dict[any, any]]) -> None:
        for dep in deps:
            for parent_name, param_mapping in dep.items():
                if parent_name not in self.name_to_node:
                    raise GraphStructureError(f"node {parent_name} does not exist")
                # add edge from parent to node
                parent = self.name_to_node[parent_name]
                self.children[parent].add(node)
                node.add_param_mapping(parent, param_mapping)

    def _inject_user_inputs(self, user_inputs: dict[any, any], queue: deque[Node]) -> None:
        for k, v in user_inputs.items():
            for node in self.name_to_node.values():
                node.inject_user_input(key=k, val=v, queue=queue)

    @staticmethod
    def _inject_params(node: Node, params: dict[any, any]) -> None:
        for key, val in params.items():
            node.inject_param(key=key, val=val)
