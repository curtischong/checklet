from core.converters.input.naut_parser import NautParser
from core.task.library.filter_by_google_search_result_count_task import filter_by_google_search_result_count_task


class TestGoogleSearchResultCount:
    def test_obscure_phrase(self):
        naut_parser = NautParser()
        input = "user creation generation"
        doc = naut_parser.parse(input)
        ans = filter_by_google_search_result_count_task([doc.tokens])
        assert ans and ans[0]
        expected_words = ["user", "creation", "generation"]
        for (token, expected) in zip(ans[0][0], expected_words):
            assert token.text == expected
    
    def test_no_obscure_phrase(self):
        naut_parser = NautParser()
        input = "benchmark testing suite"
        doc = naut_parser.parse(input)
        ans = filter_by_google_search_result_count_task([doc.tokens])
        assert not ans

