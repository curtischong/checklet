from edit_distance import EditOp
from typing import Any

class Feedback():    
    def __init__(self, nameOfCheck:str, short_desc:str, long_desc:str, editOps:list[EditOp], category:str):
        self.nameOfCheck = nameOfCheck
        self.short_desc = short_desc
        self.long_desc = long_desc
        self.category = category
        self.editOps = editOps

    def to_json(self) -> dict[str,Any]:
        return {
            "nameOfCheck":self.nameOfCheck,
            "shortDesc": self.short_desc,
            "longDesc": self.long_desc,
            "category": self.category,
            "editOps": [op.to_json() for op in self.editOps],
        }