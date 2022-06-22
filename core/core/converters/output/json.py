from typing import List

from core.engine.engine import EngineResponse

def get_json_friendly(output: EngineResponse):
    json_output = []

    for feedback in output.response:
        srcNautWord = feedback.srcNautToken.word
        json_output.append({
            "shortDesc": feedback.shortDesc,
            "longDesc": feedback.longDesc,
            "srcWord": {
                "id": srcNautWord.id,
                "text": srcNautWord.text,
                "startChar": srcNautWord.start_char,
                "endChar": srcNautWord.end_char,
            },
        })

    return json_output
