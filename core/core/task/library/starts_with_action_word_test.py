from core.task.library.starts_with_action_word_task import starts_with_action_word_task
from core.converters.input.naut_parser import NautParser

class TestActionWord:
    def test_absent_action_verb(self):
        naut_parser = NautParser()
        doc = naut_parser.parse("Bob")
        res = starts_with_action_word_task(doc.tokens)
        assert res and res[0].text == "Bob"

    def test_present_action_verb(self):
        naut_parser = NautParser()
        doc = naut_parser.parse("Created")
        res = starts_with_action_word_task(doc.tokens)
        assert not res