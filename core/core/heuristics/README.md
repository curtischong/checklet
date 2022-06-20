### Heuristics

#### Description

The following is the format of a pipeline.

```yaml
- Pipeline:
    - name: task_name_1
      task: <task_function>
    - name: task_name_2
      task: <task_function>
      dependencies:
        - <name of dependency>: { "parent_out_arg": "node_in_arg" }
```

- The `name` field is the identifier for a node in the DAG.
- The `task` field is the name of the function implementing the task, lambda or persistent. This will be the method
  invoked by this node.
- The `dependencies` object is an array. Each entry is the `name` of a parent node for the current task. The value is
  a map from the output argument name of the parent, to the input parameter name of the task. This parameter is only
  needed to express dependencies on other nodes in the DAG. See the note below on how user input is provided to nodes.

#### Nodes receiving User Input

User input, such as `NautDoc` will automatically be available to nodes via dependency injection. This is done
automatically by inspecting the python function definition of the node, and does not require any configuration.
