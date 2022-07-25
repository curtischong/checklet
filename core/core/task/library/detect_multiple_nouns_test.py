from core.converters.input.naut_parser import NautParser
from core.task.library.detect_multiple_nouns_task import detect_multiple_nouns_task


class TestMultipleNouns:
    def test_multiple_noun(self):
        naut_parser = NautParser()
        input = "Developed generic ML pipeline interface, enabling major codebase refactor to 5+ different pipelines, allowing for easier readability and maintainability of current pipeline architectures"
        doc = naut_parser.parse(input)

        res = detect_multiple_nouns_task(doc)
        assert res and res[0].text, "pipeline"


    def test_no_multiple_noun(self):
        naut_parser = NautParser()
        input = "Developed generic ML pipeline interface, enabling major"
        doc = naut_parser.parse(input)

        res = detect_multiple_nouns_task(doc)
        assert not res
