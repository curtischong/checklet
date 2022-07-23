from core.task.library.detect_obscure_acronyms_task import detect_obscure_acronyms_task
from core.converters.input.naut_parser import NautParser

class TestObscureAcronyms:
    def test_common_acronym(self):
        naut_parser = NautParser()
        input = "Worked on new NLP algorithm"
        doc = naut_parser.parse(input)
        res = detect_obscure_acronyms_task(doc)
        assert not res


    def test_obscure_acronym(self):
        naut_parser = NautParser()
        input = "Used MLML to speed up engine"
        doc = naut_parser.parse(input)
        res = detect_obscure_acronyms_task(doc)
        assert res and res[0].text == "MLML"
