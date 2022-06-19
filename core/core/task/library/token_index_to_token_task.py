from typing import List

from core.converters.tokenizer import NautDoc, NautToken


# can we make a generic MAP task? Do we even want that?
def token_index_to_token_task(doc: NautDoc, token_indexes: List[int]) -> List[NautToken]:
    tokens = []
    doc_tokens = doc.tokens()
    for i in token_indexes:
        tokens.append(doc_tokens[i])
    return tokens
