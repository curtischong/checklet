from typing import Mapping, Any, List

from core.converters.input.naut_parser import NautToken
from core.dag.node import Node


class Feedback:
    def __init__(self, short_desc: str, long_desc: str, src_naut_tokens: List[NautToken]):
        self.short_desc = short_desc
        self.long_desc = long_desc
        self.src_naut_tokens = src_naut_tokens


class FeedbackGenerator:
    def __init__(self, check_id: str, feedback_template: Mapping[Any, Any]):
        self.check_id = check_id
        self.short_desc_template = feedback_template["shortDesc"]
        # TODO: We are assuming long desc is currently static, change this
        self.long_desc_template = feedback_template["longDesc"]
        self.src_naut_tokens_var_name = feedback_template["srcNautTokens"]

    # assumes no nested "{}"
    def parse_var_names_from_str(self, src: str):
        names = []
        var_name_start = 0
        for i in range(len(src)):
            char = src[i]
            if char == "{":
                var_name_start = i + 1
            elif char == "}":
                # i-3 since we assume that all variables are lists for now
                names.append(src[var_name_start:i - 3])
        return names

    def run(self, computed_leaves: List[Node]) -> List[Feedback]:
        all_feedback = []

        all_named_outputs = {}
        for leaf in computed_leaves:
            for key, val in leaf.named_outputs.items():
                all_named_outputs[key] = val

        short_desc_vars = self.parse_var_names_from_str(self.short_desc_template)
        long_desc_vars = self.parse_var_names_from_str(self.long_desc_template)
        desc_vars = short_desc_vars + long_desc_vars

        # ensure that all of the output arrays have the same length
        n = -1
        for output_var in desc_vars:
            output_var_len = len(all_named_outputs[output_var])
            if n == -1:
                n = output_var_len
            else:
                assert n == output_var_len, "your description variables have mismatched lengths"

        # now generate each feedback
        for i in range(n):
            short_desc = self.short_desc_template
            for short_desc_var in short_desc_vars:
                short_desc = short_desc.replace(f"{{{short_desc_var}[i]}}", str(all_named_outputs[short_desc_var][i]))

            long_desc = self.long_desc_template
            for long_desc_var in long_desc_vars:
                long_desc = long_desc.replace(f"{{{long_desc_var}[i]}}", str(all_named_outputs[long_desc_var][i]))

            to_highlight = all_named_outputs[self.src_naut_tokens_var_name][i]

            if not isinstance(to_highlight, List):
                to_highlight = [to_highlight]

            all_feedback.append(Feedback(short_desc, long_desc, to_highlight))

        return all_feedback
