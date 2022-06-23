from typing import List

from core.converters.input.naut_parser import NautToken
from core.engine.engine import EngineResponse


def get_highlight_window(tokens: List[NautToken]):
    start_pos = float("inf")
    end_pos = float("-inf")
    for token in tokens:
        start_pos = min(start_pos, token.start_pos())
        end_pos = max(end_pos, token.end_pos())
    return start_pos, end_pos


def get_json_friendly(output: EngineResponse):
    json_output = []

    for feedback in output.response:
        start_pos, end_pos = get_highlight_window(feedback.src_naut_tokens)
        text = " ".join([str(token) for token in feedback.src_naut_tokens])
        json_output.append({
            "shortDesc": feedback.short_desc,
            "longDesc": feedback.long_desc,
            "srcWord": {  # TODO: rename to fragment
                "text": text,
                "startChar": start_pos,
                "endChar": end_pos,
            },
        })

    return json_output
