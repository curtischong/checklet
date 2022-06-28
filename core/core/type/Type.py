from __future__ import annotations


class InternalTypeError(Exception):
    pass


# TODO: support inheritance checking
# for now, we're going to do exact typing
# but we can construct a Python type hierarchy ourselves
# and then support isinstance(), is issubclass(), and is()
class Type:
    def __init__(self, src: str):
        self.type = _get_type(src)

    def __eq__(self: Type, other: Type):
        return self.type == other.type

    def __repr__(self):
        return self.type


def _get_type(type_str: str) -> str:
    result = type_str \
        .replace("typing.", "") \
        .replace(" ", "") \
        .replace("<", "") \
        .replace(">", "") \
        .replace("class", "") \
        .replace("'", "")

    # remove module information
    dot_index = result.rfind(".")
    if dot_index != -1:
        result = result[dot_index + 1:]

    return result


def get_types(type_str: str) -> list[Type]:
    type_str = type_str.replace("typing.", "")
    type_str = type_str.replace(" ", "")
    if not type_str.startswith("Tuple"):
        return [Type(type_str)]

    # if there are nested tuples, we use this variable
    # to know if we are in the outermost tuple
    rbrackets_remaining = 0
    ans = []
    last_var_start = 0
    for i, cur in enumerate(type_str):
        if cur == "[":
            if rbrackets_remaining == 0:
                last_var_start = i + 1
            rbrackets_remaining += 1
        elif cur == "]":
            rbrackets_remaining -= 1
            if rbrackets_remaining == 0:
                # we are finished parsing
                t = Type(type_str[last_var_start: i])
                ans.append(t)
                return ans
        elif cur == ",":
            if rbrackets_remaining == 1:
                t = Type(type_str[last_var_start:i])
                ans.append(t)
                last_var_start = i + 1
    raise InternalTypeError(f"type parsing of {type_str} failed")


if __name__ == "__main__":
    def equal(actual: list[Type], expected: list[str]):
        assert [x.type for x in actual] == expected


    equal(get_types("int"), ["int"])
    equal(get_types("typing.Tuple[typing.List[int], int]"), ["List[int]", "int"])
    equal(get_types("Tuple[Tuple[int, str], int]"), ["Tuple[int,str]", "int"])
    equal(get_types("Tuple[Tuple[Tuple[int, str], str], str]"), ["Tuple[Tuple[int,str],str]", "str"])
    equal(get_types("<class 'naut_parser.NautDoc'>"), ["NautDoc"])
    equal(get_types("<class \'naut_parser.NautDoc\'>"), ["NautDoc"])
