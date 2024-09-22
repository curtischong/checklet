def postprocess_doc(doc1, doc2):
    index1 = 0
    index2 = 0
    doc3 = ''
    
    len_doc1 = len(doc1)
    len_doc2 = len(doc2)
    
    while index2 < len_doc2:
        # Check if we're at the start of a tip tag in doc2
        if doc2.startswith('<tip:', index2):
            # Find the end of the opening tag
            tip_start_end = doc2.find('>', index2) + 1
            if tip_start_end == 0:
                raise ValueError("Malformed tip tag in doc2.")
            # Extract the tip number
            tip_number = doc2[index2+5:tip_start_end-1]
            # Construct the closing tag
            tip_end_tag = f'</tip:{tip_number}>'
            # Find the end of the closing tag
            tip_content_end = doc2.find(tip_end_tag, tip_start_end)
            if tip_content_end == -1:
                raise ValueError("Unmatched tip tag in doc2.")
            tip_end = tip_content_end + len(tip_end_tag)
            # Copy the entire tip tag and its content from doc2 to doc3
            doc3 += doc2[index2:tip_end]
            # Advance index2 past the tip content
            index2 = tip_end
        else:
            # Copy character from doc1 to doc3
            if index1 < len_doc1:
                doc3 += doc1[index1]
                index1 += 1
            # Advance index2
            index2 += 1
    # Append any remaining characters from doc1
    if index1 < len_doc1:
        doc3 += doc1[index1:]
    return doc3

# Example usage:
doc1 = "The quick brown fox jumps over the lazy dog."
doc2 = "The quick brown x jumps over the la <tip:1>agile and</tip:1> dog."

result = postprocess_doc(doc1, doc2)
print(result)

doc1 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
doc2 = "Lorems ipsum dolor <tip:2>amet, consectetur</tip:2> adipiscing elit."

result = postprocess_doc(doc1, doc2)
print(result)
