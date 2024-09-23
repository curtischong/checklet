# https://chatgpt.com/share/66f185c3-1924-800e-b4b4-8b270c342397
def fuzzy_match(doc, query, idx):
    len_query = len(query)
    delta = 10  # Allowed deviation
    window_size = len_query + 2 * delta

    # Define search window in doc
    start_pos = max(0, idx - delta)
    end_pos = min(len(doc), idx + len_query + delta)
    window_doc = doc[start_pos:end_pos]

    # Initialize scoring parameters
    match_score = 2
    mismatch_penalty = -1
    gap_penalty = -1

    # Initialize Smith-Waterman matrix
    n = len(query)
    m = len(window_doc)
    score_matrix = [[0] * (m + 1) for _ in range(n + 1)]
    max_score = 0
    max_pos = (0, 0)

    # Fill the score matrix
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            match = score_matrix[i - 1][j - 1] + (match_score if query[i - 1] == window_doc[j - 1] else mismatch_penalty)
            delete = score_matrix[i - 1][j] + gap_penalty
            insert = score_matrix[i][j - 1] + gap_penalty
            score_matrix[i][j] = max(0, match, delete, insert)

            if score_matrix[i][j] > max_score:
                max_score = score_matrix[i][j]
                max_pos = (i, j)

    # Traceback to get the alignment
    i, j = max_pos
    aligned_query = []
    aligned_window = []
    while i > 0 and j > 0 and score_matrix[i][j] > 0:
        if score_matrix[i][j] == score_matrix[i - 1][j - 1] + (match_score if query[i - 1] == window_doc[j - 1] else mismatch_penalty):
            aligned_query.append(query[i - 1])
            aligned_window.append(window_doc[j - 1])
            i -= 1
            j -= 1
        elif score_matrix[i][j] == score_matrix[i - 1][j] + gap_penalty:
            aligned_query.append(query[i - 1])
            aligned_window.append('-')
            i -= 1
        else:
            aligned_query.append('-')
            aligned_window.append(window_doc[j - 1])
            j -= 1

    aligned_query = ''.join(reversed(aligned_query))
    aligned_window = ''.join(reversed(aligned_window))

    # Calculate the actual start index in doc
    match_start_in_window = j
    actual_index = start_pos + match_start_in_window

    # Extract the matching substring from doc
    match_length = len(aligned_window.replace('-', ''))
    matching_substring = doc[actual_index:actual_index + match_length]

    return matching_substring, actual_index

doc = "This is a sample document with some text that may have discrepancies."
query = "and sample documents wit some txt that may have discrepancies"
idx = doc.find("sample")  # Expected index, possibly incorrect due to discrepancies

matching_substring, actual_index = fuzzy_match(doc, query, idx)
print("Matching Substring:", matching_substring)
print("Actual Index:", actual_index)
