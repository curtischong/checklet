def only_one(*args):
    num_not_none = 0
    for arg in args:
        if arg:
            num_not_none += 1
    return num_not_none == 1
