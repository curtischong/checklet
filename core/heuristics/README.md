### Heuristics

the format is

TODO: finish

```yaml
- Pipeline:
    - taskName1
        - deps: [ ]
    - taskName2
        - deps: [ taskName2 ] 
```

The last taskname is implied to be a feedback task

we need to specify which dependencies go into which parameter of each check