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

TODO: make it so that functions that return 1 variable don't need to have a named output
