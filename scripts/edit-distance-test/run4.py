import re

def postprocess_doc(doc1, doc2):
    # Step 1: Extract edits from doc2
    tip_pattern = re.compile(r'<tip:(\d+)>(.*?)<old:\d+:new>(.*?)</tip:\1>', re.DOTALL)
    edits = []

    for match in tip_pattern.finditer(doc2):
        tip_number = match.group(1)
        old_text = match.group(2)
        new_text = match.group(3)
        edits.append((old_text, new_text))

    # Step 2: Apply edits to doc1
    doc3 = ''
    index1 = 0  # Pointer in doc1
    edit_index = 0  # Index of the current edit

    while index1 < len(doc1):
        if edit_index < len(edits):
            old_text, new_text = edits[edit_index]
            position = doc1.find(old_text, index1)
            if position == -1:
                # Old text not found; copy remaining doc1
                doc3 += doc1[index1:]
                break
            else:
                # Copy text up to the old text
                doc3 += doc1[index1:position]
                # Replace old text with new text
                doc3 += new_text
                # Advance index1 past the old text
                index1 = position + len(old_text)
                # Move to the next edit
                edit_index += 1
        else:
            # No more edits; copy remaining doc1
            doc3 += doc1[index1:]
            break

    return doc3

# Example usage:
doc1 = "This is a sentence that needs editing."
doc2 = "Irrelevant text. This is a <tip:1>sentence<old:1:new>line</tip:1> that needs editing. More irrelevant text."

result = postprocess_doc(doc1, doc2)
print(result)

