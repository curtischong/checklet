def postprocess_doc(doc1, doc2):
    index1 = 0
    index2 = 0
    doc3 = ''

    len_doc1 = len(doc1)
    len_doc2 = len(doc2)

    while index2 < len_doc2:
        # Check for the start of a tip tag
        if doc2.startswith('<tip:', index2):
            # Find the end of the tip tag
            tip_end = doc2.find('</tip:', index2)
            if tip_end == -1:
                # Handle case where closing tag is not found
                raise ValueError("Unmatched tip tag in doc2.")
            # Find the end of the closing tag
            tip_end = doc2.find('>', tip_end) + 1
            # Copy the entire tip tag and its content
            doc3 += doc2[index2:tip_end]
            index2 = tip_end
        else:
            if index1 < len_doc1 and doc1[index1] == doc2[index2]:
                # Characters match, copy to doc3
                doc3 += doc1[index1]
                index1 += 1
                index2 += 1
            else:
                # Extra character in doc2, skip it
                index2 += 1
    return doc3

# Example usage:
doc1 = "The quick brown fox jumps over the lazy dog."
doc2 = "The quick brown foox jumps over the laazy <tip:1>and sleepy</tip:1> dog."

result = postprocess_doc(doc1, doc2)
print(result)
