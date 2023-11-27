from types import Range

class Feedback():    
    def __init__(self, short_desc:str, long_desc:str, highlight_ranges:Range, , category:str):
        self.short_desc = short_desc
        self.long_desc = long_desc
        self.highlight_ranges = highlight_ranges
        self.replacement_text = replacement_text
        self.category = category

    def _get_json_for_ranges(ranges: list[Range]) -> list[dict[str, int]]:
        return [hrange.json() for hrange in ranges]

    def to_json(self) -> dict[str,str]:
        return {
            "shortDesc": self.short_desc,
            "longDesc": self.long_desc,
            "highlightRanges": self._get_json_for_ranges(self.highlight_ranges),

            # These are the ranges to highlight when the user clicks on the longDesc
            "replacementText": self.replacement_text,
            "category": self.category,
        }