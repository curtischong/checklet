class Range:
    def __init__(self, start:int, end:int):
        self.start = start
        self.end = end

    def to_json(self) -> dict[str,int]:
        return {
            "start": self.start,
            "end": self.end
        }

    def is_adjacent(self, other:"Range"):
        # Check if two ranges are adjacent
        return self.end == other.start

    def merge(self, other:"Range"):
        # Merge two adjacent ranges
        self.end = other.end
