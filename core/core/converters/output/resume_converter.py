from typing import List

from core.engine.engine import EngineResponse
from core.heuristics.feedback import HighlightRange


def _get_json_for_ranges(ranges: List[HighlightRange]) -> List[dict[str, int]]:
    return [hrange.json() for hrange in ranges]


def get_json_friendly(output: EngineResponse) -> List[dict[str, any]]:
    json_output = []

    for feedback in output.response:
        json_output.append({
            "shortDesc": feedback.short_desc,
            "longDesc": feedback.long_desc,
            "highlightRanges": _get_json_for_ranges(feedback.highlight_ranges),

            # These are the ranges to highlight when the user clicks on the longDesc
            "highlightRangesOnSelect": _get_json_for_ranges(feedback.highlight_ranges_on_select),

            # deprecated
            "srcWord": {
                "text": "",  # I don't think we need to surface this to the user since we return highlight chunks
                "startChar": 0,
                "endChar": 1
            },
        })

    return json_output
