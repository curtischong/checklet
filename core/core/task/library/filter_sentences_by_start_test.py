from core.task.library.filter_sentences_by_start_task import filter_sentences_by_start_task
from core.converters.input.naut_parser import NautParser

class TestActionWord:
    def test_sentence_has_word(self):
        naut_parser = NautParser()
        doc = naut_parser.parse("Bob went to the farm in January")
        res = filter_sentences_by_start_task(doc, {"bob"})
        assert res and len(res) == 1

    def test_sentence_does_not_have_word(self):
        naut_parser = NautParser()
        doc = naut_parser.parse("Created storage engine")
        res = filter_sentences_by_start_task(doc, {"january"})
        assert not res