from core.engine.engine import EngineResponse
from core.heuristics.feedback import HighlightRange


def _get_json_for_ranges(ranges: list[HighlightRange]) -> list[dict[str, int]]:
    return [hrange.json() for hrange in ranges]


def get_json_friendly(output: EngineResponse) -> list[dict[str, any]]:
    json_output = []

    for feedback in output.response:
        json_output.append({
            "shortDesc": feedback.short_desc,
            "longDesc": feedback.long_desc,
            "highlightRanges": _get_json_for_ranges(feedback.highlight_ranges),

            # These are the ranges to highlight when the user clicks on the longDesc
            "highlightRangesOnSelect": _get_json_for_ranges(feedback.highlight_ranges_on_select),
            "replacementText": feedback.replacement_text,
            "srcNautObj": str(feedback.src_naut_obj),
            "feedbackType": feedback.type,

            # deprecated
            "srcWord": {
                "text": "",  # I don't think we need to surface this to the user since we return highlight chunks
                "startChar": 0,
                "endChar": 1
            },
        })

    return json_output
