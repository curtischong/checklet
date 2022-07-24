from core.task.library.filter_first_words_task import filter_first_words_task
from core.task.test.task_parsing_helper import NautParser

class TestFirstWord:
    def test_first_word_exists(self):
        naut_parser = NautParser()
        doc = naut_parser.parse("Created our engine")
        res = filter_first_words_task(doc)
        assert res and res[0].text == "Created"

    def test_no_first_word(self):
        naut_parser = NautParser()
        doc = naut_parser.parse("")
        res = filter_first_words_task(doc)
        assert not res