import pathlib

import numpy as np

from core.converters.input.naut_parser import NautToken

# TODO: init this dataset when the server first starts (so we cam move it to the TaskParsingHelper
path = str(pathlib.Path(__file__).parent) + "/../../../../backend/datasets/embeddings/"
print(path)
embeddings = np.load(path + 'all_embeddings.npy')
words = np.load(path + 'all_words.npy')
word_to_vec = dict(zip(words, embeddings))


def get_k_closest_words(query_vector, words, matrix, k):
    scores = matrix.dot(query_vector)
    best_indexes = np.argpartition(scores, -k)[-k:]
    best_words = np.take(words, best_indexes)
    best_scores = np.take(scores, best_indexes)
    ans = list(zip(best_scores, best_words))
    ans.sort(reverse=True)
    return [word for _, word in ans]


def query_for_words(qwords, word_to_vec):
    nwords = len(qwords)
    ans = np.zeros([300])
    for word in qwords:
        ans += word_to_vec[word]
    return ans / nwords


def get_synonym_task(queries: list[list[NautToken]]) -> list[list[str]]:
    synonyms = []
    for query in queries:
        tokens = [token.text for token in query]
        qvector = query_for_words(tokens, word_to_vec)
        synonyms.append(get_k_closest_words(qvector, words, embeddings, 5))
    return synonyms
