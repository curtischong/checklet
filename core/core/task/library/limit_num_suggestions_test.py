from core.task.library.limit_num_suggestions_task import limit_num_suggestions_task


class TestLimitNumSuggestions:
    def test_num_suggestins_exceeds_limit(self):
        res = limit_num_suggestions_task([["a", "b", "c"]], max_suggestions=2)
        assert res == [["a", "b"]]

    def test_num_suggestins_within_limit(self):
        res = limit_num_suggestions_task([["a", "b", "c"]], max_suggestions=5)
        assert res == [["a", "b", "c"]]
