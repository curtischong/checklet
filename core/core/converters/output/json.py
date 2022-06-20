from typing import List

from core.converters.input.naut_parser import NautWord
from core.engine.engine import EngineResponse

def get_json_friendly(output: EngineResponse):
    friendly_output = []
    for item in output.response:
        friendly_item = None
        # TODO: Switch to standard type checking
        if isinstance(item, list):
            friendly_item = []
            for list_item in item:
                if type(list_item) == NautWord:
                    friendly_item.append(repr(list_item))
                else:
                    friendly_item.append(list_item)
        else:
            friendly_item = item
        friendly_output.append(friendly_item)

    return friendly_output
