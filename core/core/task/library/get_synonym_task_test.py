import pytest

from core.converters.input.naut_parser import NautParser
from core.models.NautEmbeddings import NautEmbeddings
from core.task.library.get_synonym_task import get_synonym_task


class TestGetSynonyms:
    @pytest.mark.skip(reason="cannot test due to requiring NautEmbeddings")
    def test_get_synonym(self):
        naut_parser = NautParser()
        doc = naut_parser.parse("designed and implemented")
        naut_embeddings = NautEmbeddings()
        synonyms = get_synonym_task([doc.tokens], naut_embeddings)
        expected_words = ["designed", "implemented", "implement", "Orano", "built"]
        assert synonyms
        for (synonym, expected) in zip(synonyms[0], expected_words):
            assert synonym == expected
 