from core.converters.input.naut_parser import NautParser
from core.task.library.detect_contiguous_spaces_task import detect_contiguous_spaces_task


class TestDetectContiguousSpaces:
    def test_detect_contiguous_spaces(self):
        naut_parser = NautParser()
        input = "I made the server  10% faster"
        doc = naut_parser.parse(input)

        res = detect_contiguous_spaces_task(doc)
        assert res and res[0].text, "contiguous"

    def test_no_contigious_spaces(self):
        naut_parser = NautParser()
        input = "I made the server 10% faster"
        doc = naut_parser.parse(input)

        res = detect_contiguous_spaces_task(doc)
        assert not res
