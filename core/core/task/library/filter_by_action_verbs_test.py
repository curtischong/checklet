import pytest

from core.lib.corpus.action_verbs import ActionVerbs
from core.task.library.filter_by_action_verbs_task import filter_by_action_verbs_task


class TestFilterByActionVerbs:
    @pytest.mark.skip(reason="cannot test due to requiring ActionVerbs")
    def test_keep_action_verbs(self):
        input = [["designed", "ate", "organized"]]
        res = filter_by_action_verbs_task(input, ActionVerbs())
        assert res == [["designed", "organized"]]
