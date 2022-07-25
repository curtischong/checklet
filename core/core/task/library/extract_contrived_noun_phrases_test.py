from core.converters.input.naut_parser import NautParser
from core.task.library.extract_contrived_noun_phrases_task import extract_contrived_noun_phrases_task


class TestContrivedNouns:
    def test_contrived_nouns_one(self):
        naut_parser = NautParser()
        input = "Optimized user creation generation using ASP.Net and React, reducing wait time by 80%."
        doc = naut_parser.parse(input)
        res = extract_contrived_noun_phrases_task(doc)
        assert len(res) == 1

        expected_words = ["user", "creation", "generation"]
        for (token, expected) in zip(res[0], expected_words):
            assert token.text == expected

    def test_contrived_nouns_two(self):
        naut_parser = NautParser()
        input = "user creation generation randomizer"
        doc = naut_parser.parse(input)
        res = extract_contrived_noun_phrases_task(doc)
        assert len(res) == 1
        
        expected_words = ["user", "creation", "generation", "randomizer"]
        for (token, expected) in zip(res[0], expected_words):
            assert token.text == expected

    def test_contrived_nouns_three(self):
        naut_parser = NautParser()
        input = "Selected our storage engine by creating our benchmark testing suite tracking latency and memory per operation, as well as total disk usage for various key value stores."
        doc = naut_parser.parse(input)
        res = extract_contrived_noun_phrases_task(doc)
        assert len(res) == 1
        
        expected_words = ["testing", "suite", "tracking", "latency"]
        for (token, expected) in zip(res[0], expected_words):
            assert token.text == expected