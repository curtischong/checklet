import numpy as np
from numpy import ndarray

from core.converters.input.naut_parser import NautToken
from core.lib.models.naut_embeddings import NautEmbeddings


# How this works:
# Create a query vector that is the average of all word vectors in the query words
def query_for_words(qwords: list[str], naut_embeddings: NautEmbeddings) -> ndarray:
    n = len(qwords)
    combined_embedding = np.zeros(NautEmbeddings.embedding_len)
    for word in qwords:
        combined_embedding += naut_embeddings.vec_of_word(word)
    return combined_embedding / n


def get_synonym_task(queries: list[list[NautToken]], naut_embeddings: NautEmbeddings, num_synonyms: int) \
        -> list[list[str]]:
    synonyms = []
    for query in queries:
        tokens = [str(token) for token in query]
        qvector = query_for_words(tokens, naut_embeddings)
        synonyms.append(naut_embeddings.get_k_closest_words(qvector, num_synonyms))
    return synonyms
