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
        self.short_desc_template = feedback_template["shortDesc"]
        # TODO: We are assuming long desc is currently static, change this
        self.long_desc_template = feedback_template["longDesc"]
        self.src_naut_tokens_var_name = feedback_template["srcNautTokens"]

    def run(self, computed_leaves: List[Node]) -> List[Feedback]:
        check_feedback = []
        src_naut_tokens = []
        naut_tokens_var_name = self.src_naut_tokens_var_name

        for leaf in computed_leaves:
            if naut_tokens_var_name in leaf.named_outputs:
                src_naut_tokens += leaf.named_outputs[naut_tokens_var_name]

        for idx, token in enumerate(src_naut_tokens):
            src_naut_tokens_var = f"{naut_tokens_var_name}[{idx}]"
            short_desc = self.short_desc_template.replace(f"{naut_tokens_var_name}[i]", src_naut_tokens_var)
            long_desc = self.long_desc_template.replace(f"{naut_tokens_var_name}[i]", src_naut_tokens_var)
            param_map = {
                naut_tokens_var_name: src_naut_tokens,
            }
            short_desc = short_desc.format(**param_map)
            long_desc = long_desc.format(**param_map)
            check_feedback.append(Feedback(short_desc, long_desc, token))

        return check_feedback
