from typing import Mapping, Any, List

from core.converters.input.naut_parser import NautToken
from core.dag.node import Node


class Feedback:
    def __init__(self, shortDesc: str, longDesc: str, srcNautToken: NautToken):
        self.shortDesc = shortDesc
        self.longDesc = longDesc
        self.srcNautToken = srcNautToken


class FeedbackGenerator:
    def __init__(self, check_id: str, feedback_template: Mapping[Any, Any]):
        self.check_id = check_id
        self.shortDescTemplate = feedback_template["shortDesc"]
        # TODO: We are assuming long desc is currently static, change this
        self.longDescTemplate = feedback_template["longDesc"]
        self.srcNautTokensVarName = feedback_template["srcNautTokens"]

    def run(self, computed_leaves: List[Node]) -> List[Feedback]:
        check_feedback = []
        src_naut_tokens = []
        nautTokensVarName = self.srcNautTokensVarName

        for leaf in computed_leaves:
            if nautTokensVarName in leaf.named_outputs:
                src_naut_tokens += leaf.named_outputs[nautTokensVarName]

        for idx, token in enumerate(src_naut_tokens):
            srcNautTokensVar = f"{nautTokensVarName}[{idx}]"
            shortDesc = self.shortDescTemplate.replace(f"{nautTokensVarName}[i]", srcNautTokensVar)
            shortDescMap = {
                nautTokensVarName: src_naut_tokens,
            }
            shortDesc = shortDesc.format(**shortDescMap)
            longDesc = self.longDescTemplate
            check_feedback.append(Feedback(shortDesc, longDesc, token))

        return check_feedback
