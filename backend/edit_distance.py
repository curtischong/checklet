from feedback_types import Range
from typing import Any

class EditOp:
    def __init__(self, range:Range, newString:str):
        self.range = range
        self.newString = newString

    def __repr__(self):
        return f"EditOperation(Range({self.range.start}, {self.range.end}), '{self.newString}')"

    def to_json(self) -> dict[str,Any]:
        return {
            "range": self.range.to_json(),
            "newString": self.newString
        }


def edit_distance_operations_with_classes(str1:str, str2:str):

    # Create a matrix for storing edit distances
    m, n = len(str1), len(str2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Initialize the first row and column
    for i in range(m + 1):
        dp[i][0] = i  # Deletion cost
    for j in range(n + 1):
        dp[0][j] = j  # Insertion cost

    # Compute the edit distance matrix
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if str1[i - 1] == str2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]  # No operation needed
            else:
                dp[i][j] = 1 + min(dp[i - 1][j],      # Delete
                                   dp[i][j - 1],      # Insert
                                   dp[i - 1][j - 1])  # Replace

    # Trace back to find the operations
    operations = []
    i, j = m, n
    while i > 0 and j > 0:
        if str1[i - 1] == str2[j - 1]:
            i, j = i - 1, j - 1
        elif dp[i][j] == dp[i - 1][j - 1] + 1:  # Replace
            operations.append({'range': Range(i - 1, i), 'newString': str2[j - 1]})
            i, j = i - 1, j - 1
        elif dp[i][j] == dp[i - 1][j] + 1:  # Delete
            operations.append({'range': Range(i - 1, i), 'newString': ''})
            i -= 1
        elif dp[i][j] == dp[i][j - 1] + 1:  # Insert
            operations.append({'range': Range(j - 1, j), 'newString': str2[j - 1]})
            j -= 1

    # Handle remaining characters in str1 (deletions) or str2 (insertions)
    while i > 0:
        operations.append({'range': Range(i - 1, i), 'newString': ''})
        i -= 1
    while j > 0:
        operations.append({'range': Range(j - 1, j), 'newString': str2[j - 1]})
        j -= 1



    # Consolidate adjacent operations
    consolidated_operations:list[EditOp] = []
    for op in operations[::-1]:
        if consolidated_operations and consolidated_operations[-1].range.is_adjacent(op['range']):
            consolidated_operations[-1].range.merge(op['range'])
            consolidated_operations[-1].newString += op['newString']
        else:
            consolidated_operations.append(EditOp(op['range'], op['newString']))

    return consolidated_operations

# Example usage
# print(edit_distance_operations_with_classes("kitten", "sittinggg"))
