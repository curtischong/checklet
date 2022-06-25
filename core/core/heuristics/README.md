### Heuristics

#### Description

The following is the format of a pipeline.

```yaml
Pipeline:
  - name: task_name_1
    task: <task_function>
    outputs: [ <output_name_for_var_you_assign> ]
  - name: task_name_2
    task: <task_function>
    dependencies:
      - <name of dependency>: { "parent_out_arg": "node_in_arg" }
Feedback:
  shortDesc: "Consider changing {pronouns[i]} to the"
  longDesc: "This will make your resume be in third person."
  srcNautTokens: "pronouns"
  srcNautSentences:
  srcNautTokensOnSelect:
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

#### Feedback

Every feedback requires a `shortDesc`, `longDesc`, and one of (`srcNautTokens` or `srcNautSentences`)
There's also an optional `srcNautTokensOnSelect` which you can use to specify
the tokens to highlight when a user selects a feedback to look at.

`srcNautTokens`/`srcNautSentences` can only contain a single variable. This variable must be a list of tokens/sentences.
The number of feedback cards generated is equal to the number of elements in `srcNautTokens`/`srcNautSentences`.

`srcNautTokens`/`srcNautSentences`/`srcNautTokensOnSelect` can be a list of NautTokens, a list of list of NautTokens,
or a list of a list of a list of NautTokens (or NautSentences).

If it's:

- A list of NautTokens, then the feedback will just highlight one token
- A list of list of NautTokens, multiple tokens will be individually highlighted.
- A list of list of list of NautTokens, we have a chunk of list of nauttokens.
    - Each chunk is a list of NautTokens. All of the tokens in the Chunk should be contiguous and each chunk will be
      contiguously highlighted.
    - Use chunks if you want the feedback to highlight multiple contiguous groups of tokens.

#### Descriptions

`shortDesc` and `longDesc` describes templates for the feedback descriptions. All feedback generated
will have these descriptions in the card. If you want to specify variables in these descriptions,
they must be of the format `{<var_name>[i]}` where `var_name` is an output that is defined by a
task in the pipeline. This output must be a list that has the same length as the number
of feedback generated.

