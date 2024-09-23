import difflib
import re


def tokenize_doc(doc, is_doc2=False):
    # Regular expression to match tip tags
    tip_tag_pattern = re.compile(r'<tip:\d+>.*?<old:\d+:new>.*?</tip:\d+>', re.DOTALL)
    # Tokenize the document, keeping tip tags as single tokens
    tokens = []
    pos = 0
    while pos < len(doc):
        tip_match = tip_tag_pattern.search(doc, pos)
        if tip_match and tip_match.start() == pos:
            # Add the entire tip tag as a single token
            tokens.append(tip_match.group())
            pos = tip_match.end()
        else:
            # Add the next character as a token
            tokens.append(doc[pos])
            pos += 1
    return tokens

def postprocess_doc(doc1, doc2):
    # Tokenize both documents
    tokens1 = list(doc1)  # For doc1, we can tokenize by character
    tokens2 = tokenize_doc(doc2, is_doc2=True)
    
    # Use SequenceMatcher to align the tokens
    # WOW! this uses gestalt pattern matching
    matcher = difflib.SequenceMatcher(None, tokens1, tokens2)
    opcodes = matcher.get_opcodes()
    
    doc3_tokens = []
    for tag, i1, i2, j1, j2 in opcodes:
        if tag == 'equal':
            # Tokens are the same; copy from doc1
            doc3_tokens.extend(tokens1[i1:i2])
        elif tag == 'insert':
            # Tokens inserted in doc2
            # Check if the inserted tokens are tip tags
            inserted_tokens = tokens2[j1:j2]
            for token in inserted_tokens:
                if token.startswith('<tip:'):
                    # Insert the tip tag into doc3
                    doc3_tokens.append(token)
                # Else: ignore other insertions (changes outside tip tags)
        elif tag == 'delete':
            # Tokens deleted from doc1; ignore (keep original from doc1)
            doc3_tokens.extend(tokens1[i1:i2])
        elif tag == 'replace':
            # Tokens replaced
            # Check if the replacement in doc2 is a tip tag
            replaced_tokens = tokens2[j1:j2]
            inserted_tip_tags = [token for token in replaced_tokens if token.startswith('<tip:')]
            if inserted_tip_tags:
                # Insert the tip tags into doc3
                for token in inserted_tip_tags:
                    doc3_tokens.append(token)
                # Advance i1 to skip the old text in doc1 that was replaced
            else:
                # No tip tags; copy from doc1
                doc3_tokens.extend(tokens1[i1:i2])
    
    # Reconstruct doc3 from tokens
    doc3 = ''.join(doc3_tokens)
    return doc3

# Example usage:
doc1 = "sentence 1. This is a sentence that needs editing."
doc2 = "Irrelevant text. sentence 1. This is a <tip:1>sentence<old:1:new>line</tip:1> that needs editing. More irrelevant text."

result = postprocess_doc(doc1, doc2)
print(result)

