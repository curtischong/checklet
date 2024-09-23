import re

def postprocess_doc(doc1, doc2):
    # Step 1: Extract tip tags from doc2
    tip_pattern = re.compile(
        r'(<tip:(\d+)>(.*?)<old:\d+:new>(.*?)</tip:\2>)',
        re.DOTALL
    )
    tip_tags = []
    for match in tip_pattern.finditer(doc2):
        full_tip_tag = match.group(1)  # Entire tip tag including <tip> and </tip>
        tip_number = match.group(2)
        old_text = match.group(3)
        new_text = match.group(4)
        tip_tags.append({
            'full_tip_tag': full_tip_tag,
            'old_text': old_text,
            'new_text': new_text
        })
    
    # Step 2: Apply tip tags to doc1
    doc3 = ''
    index1 = 0  # Pointer in doc1
    last_replacement_end = 0  # To keep track of the last replaced position in doc1

    for tip_tag in tip_tags:
        old_text = tip_tag['old_text']
        full_tip_tag = tip_tag['full_tip_tag']
        # Find the next occurrence of old_text in doc1 after the last replacement
        position = doc1.find(old_text, last_replacement_end)
        if position == -1:
            # Old text not found; skip this tip tag
            continue
        else:
            # Copy text from the last replacement up to the position of old_text
            doc3 += doc1[last_replacement_end:position]
            # Insert the full tip tag from doc2
            doc3 += full_tip_tag
            # Update last_replacement_end to position after the old_text
            last_replacement_end = position + len(old_text)
    
    # Copy any remaining text from doc1 after the last replacement
    doc3 += doc1[last_replacement_end:]
    
    return doc3

# Example usage:
doc1 = "This is a sentence that needs editing."
doc2 = "Irrelevant text. This is a <tip:1>sentence<old:1:new>line</tip:1> that needs editing. More irrelevant text."

result = postprocess_doc(doc1, doc2)
print(result)

