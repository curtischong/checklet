import os
import pathlib

import numpy as np
from numpy.core import ndarray


class NautEmbeddings:
    embedding_len = 300

    def __init__(self):
        path = pathlib.Path(__file__).parent.joinpath("../../datasets/embeddings")
        # this is a 2D matrix of embeddings for each word
        # y axis: words. x axis: the embedding for that word
        word_embeddings = np.load(os.path.join(path, 'word_embeddings.npz'))
        self.words: ndarray = word_embeddings['words']
        self.embeddings: ndarray = word_embeddings['embeddings']

        self.word_to_vec = dict(zip(self.words, self.embeddings))

    def vec_of_word(self, word: str) -> ndarray:
        oov_embedding = np.zeros(self.embedding_len)  # out of vocabulary
        return self.word_to_vec.get(word, oov_embedding)

    def get_k_closest_words(self, query_vector: ndarray, k) -> list[str]:
        scores = self.embeddings.dot(query_vector)
        best_indexes = np.argpartition(scores, -k)[-k:]
        best_words = np.take(self.words, best_indexes)
        best_scores = np.take(scores, best_indexes)
        ans = list(zip(best_scores, best_words))
        ans.sort(reverse=True)
        return [word for _, word in ans]
