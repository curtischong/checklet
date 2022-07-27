import pytest

from core.task.test.task_parsing_helper import TaskParsingHelper


class TestExtractVerbClauses:
    @pytest.mark.skip(reason="cannot test due to requiring the ActionVerbs dataset")
    def test_recognizes_action_verb(self):
        assert TaskParsingHelper().action_verbs.in_action_verbs("automated")
