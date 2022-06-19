# How to Write a Task

### Lambda Tasks

These are tasks that are like lambda functions. There is no initialization involved

Write these tasks just like normal functions. You need to annotate the input and return types.

The only special thing you need to do is to make sure that there exists a return line such that all the values returned
are from variables. In this return line, do not inline a constant. For example:

```
GOOD: return trimmed_string, old_str_len
BAD:  return str.trim(), len(str)
```

Note: Only 1 line in your task needs to be this way, so if you do early returns you don't need to. The reason why you
need to do this is for functions that return multiple variables, the task parser can assign variable names to the nth
variable you return

Note: your task name must end in `task` so we know which function is the task for that file Note: Tasks that return only
one variable don't need to name that variable

### Persistent Tasks

Tasks that depends on neural networks spend a lot of time loading in model weights. It is wasteful to Load these weights
everytime the task is run.

Persistent tasks solve this problem by allowing your task to persist the loaded weights in memory.

These tasks are the same as lambda tasks, except they are created when the engine starts and persist throughout the
engine's lifetime. On creation, we can load datasets and store them in memory in anticipation for when this task is
executed.

Since we have to store state, persistent tasks are implemented as classes. You simply have to write two functions:

`init`: Used to load data. Init can take parameters, which will be dependency-injected on startup (if the engine knows
what those values are)
`process`: This is the function that is called when the task is called in the DAG. All the rules about specifying type
annotations (and return variable names) remain the same, except the function is called process now.

The task name is the name of your class. 