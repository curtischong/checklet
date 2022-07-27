from core.converters.input.naut_parser import NautParser
from core.task.library.extract_verb_conjunctions_at_sentence_start_task import \
    extract_verb_conjunctions_at_sentence_start_task


class TestExtractVerbConjunctionsAtSentenceStart:
    def test_verb_conjunction_exists(self):
        naut_parser = NautParser()
        input = "led and organized a retreat"
        doc = naut_parser.parse(input)
        res = extract_verb_conjunctions_at_sentence_start_task(doc)
        assert len(res) == 1
        result_text = [str(token) for token in res[0]]
        assert result_text == ["led", "organized"]

    def test_verb_conjunction_absent(self):
        naut_parser = NautParser()
        input = "organized a retreat"
        doc = naut_parser.parse(input)
        res = extract_verb_conjunctions_at_sentence_start_task(doc)
        assert not res