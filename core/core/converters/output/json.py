from typing import List

from core.engine.engine import EngineResponse

def get_json_friendly(output: EngineResponse):
    json_output = []

    for feedback in output.response:
         json_output.append({
            "shortDesc": feedback.shortDesc,
            "longDesc": feedback.longDesc,
            "srcToken": feedback.srcNautToken.word,
        })

    return json_output
