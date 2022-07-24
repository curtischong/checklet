from core.task.library.filter_tense_task import filter_tense_task
from core.task.test.task_parsing_helper import NautParser

class TestTense:
    def test_past_tense_filtered(self):
        naut_parser = NautParser()
        doc = naut_parser.parse("Created the engine")
        res = filter_tense_task(doc.tokens, "past")
        assert res and res[0].text == "the" and res[1].text == "engine"

    def test_past_tense_not_found(self):
        naut_parser = NautParser()
        doc = naut_parser.parse("Creating the engine")
        res = filter_tense_task(doc.tokens, "past")
        assert res and len(res) == 3
