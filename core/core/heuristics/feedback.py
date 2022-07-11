from __future__ import annotations

from typing import Union

from core.converters.input.naut_parser import NautToken, NautSent
from core.dag.node import Node
from core.lib.utils.optional import only_one


class HighlightRange:
    def __init__(self, start_pos: int, end_pos: int):
        self.start_pos = start_pos
        self.end_pos = end_pos

    @classmethod
    def from_naut_token(cls, naut_token: NautToken) -> HighlightRange:
        return cls(naut_token.start_pos(), naut_token.end_pos())

    @classmethod
    def from_naut_sent(cls, naut_sent: NautSent) -> HighlightRange:
        return cls(naut_sent.tokens[0].start_pos(), naut_sent.tokens[-1].end_pos())

    @classmethod
    def from_naut_obj(cls, naut_obj: Union[NautToken, NautSent]) -> HighlightRange:
        if isinstance(naut_obj, NautToken):
            return cls.from_naut_token(naut_obj)
        elif isinstance(naut_obj, NautSent):
            return cls.from_naut_sent(naut_obj)
        else:
            raise TypeError(f"cannot extract highlight range for naut_obj of type {type(naut_obj)}")

    @classmethod
    def from_naut_chunk(cls, naut_obj_chunk: list[Union[NautToken, NautSent]]) -> HighlightRange:
        first_obj = HighlightRange.from_naut_obj(naut_obj_chunk[0])
        last_obj = HighlightRange.from_naut_obj(naut_obj_chunk[-1])
        return HighlightRange(first_obj.start_pos, last_obj.end_pos)

    def __repr__(self) -> str:
        return str((self.start_pos, self.end_pos))

    def json(self) -> dict[str, int]:
        return {
            "startPos": self.start_pos,
            "endPos": self.end_pos
        }


class Feedback:
    def __init__(self, short_desc: str, long_desc: str, highlight_ranges: list[HighlightRange],
                 highlight_ranges_on_select: list[HighlightRange], src_naut_obj: any, replacement_text: str, type: str):
        self.short_desc = short_desc
        self.long_desc = long_desc
        self.highlight_ranges = highlight_ranges
        self.highlight_ranges_on_select = highlight_ranges_on_select
        self.src_naut_obj = src_naut_obj
        self.replacement_text = replacement_text
        self.type = type


class FeedbackGenerator:
    def __init__(self, check_id: str, feedback_template: dict[any, any]):
        self.check_id = check_id
        self.short_desc_template = feedback_template["shortDesc"]
        self.long_desc_template = feedback_template["longDesc"]
        self.feedback_type = feedback_template["type"]

        # We currently assume that there is only one variable in "srcNautTokens" or "srcNautSentences"
        # Otherwise, we'll need to check if their types are the same. It also introduces
        # extra complexity since we have to concatenate each arrays of all srcNautToken variables
        # But which array goes first when we concatenate them together?
        # I guess one assumption we can make is to concat all the lists in the same order as they appear in the yaml
        self.src_naut_tokens_var_name = feedback_template.get("srcNautTokens")
        self.dst_text_var_name = feedback_template.get("dstText")
        self.src_naut_sentences_var_name = feedback_template.get("srcNautSentences")
        assert only_one(self.src_naut_tokens_var_name, self.src_naut_sentences_var_name), \
            f"The Feedback for {check_id} can only contain one of srcNautTokens or srcNautSentences in the .yaml"

        self.src_naut_tokens_on_select_var_name = feedback_template.get("srcNautTokensOnSelect")

    def run(self, computed_leaves: list[Node]) -> list[Feedback]:
        all_feedback = []

        # maps var name (assigned in yaml) -> output from leaf
        var_to_output = self._extract_output_from_computed_leaves(computed_leaves)

        short_desc_vars = self._parse_var_names_from_str(self.short_desc_template)
        long_desc_vars = self._parse_var_names_from_str(self.long_desc_template)
        desc_vars = short_desc_vars + long_desc_vars

        num_feedback = self._num_feedback(var_to_output)
        self._validate_vars_length(num_feedback, var_to_output, desc_vars)
        self._validate_replacement_length(num_feedback, var_to_output)

        # now generate each feedback
        for feedback_idx in range(num_feedback):
            short_desc = self._inject_desc_vars(short_desc_vars, self.short_desc_template, feedback_idx, var_to_output)
            long_desc = self._inject_desc_vars(long_desc_vars, self.long_desc_template, feedback_idx, var_to_output)

            src_naut_obj, highlight_ranges, highlight_ranges_on_select = self._calculate_highlight_ranges(feedback_idx,
                                                                                                          var_to_output)
            dst_text = self._calculate_dst_text(feedback_idx, var_to_output)

            all_feedback.append(
                Feedback(short_desc, long_desc, highlight_ranges, highlight_ranges_on_select, src_naut_obj, dst_text,
                         self.feedback_type))

        return all_feedback

    def _extract_output_from_computed_leaves(self, computed_leaves: list[Node]) -> dict[str, any]:
        var_to_output = {}
        for leaf in computed_leaves:
            for key, val in leaf.named_outputs.items():
                var_to_output[key] = val
        return var_to_output

    # assumes no nested "{}"
    def _parse_var_names_from_str(self, src: str) -> list[str]:
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

    def _num_feedback(self, var_to_output: dict[str, any]) -> int:
        if self.src_naut_tokens_var_name:
            return len(var_to_output[self.src_naut_tokens_var_name])
        elif self.src_naut_sentences_var_name:
            return len(var_to_output[self.src_naut_sentences_var_name])
        else:
            raise ValueError(f"unknown number of feedback for Check {self.check_id}")

    def _validate_vars_length(self, num_feedback: int, var_to_output: dict[str, any],
                              desc_vars: list[str]) -> None:
        # ensure that all of the variables used by the descriptions have the same length as the number of feedback

        for output_var in desc_vars:
            output_var_len = len(var_to_output[output_var])
            if output_var_len != num_feedback:
                print(
                    f"WARNING: {output_var} is a list of length {output_var_len}, but there are {num_feedback} feedback"
                    f"generated")

        if self.src_naut_tokens_on_select_var_name:
            on_select_len = len(var_to_output[self.src_naut_tokens_on_select_var_name])
            if on_select_len != num_feedback:
                print(
                    f"WARNING: {self.src_naut_tokens_on_select_var_name} is a list of length {on_select_len},"
                    f"but there are {num_feedback} feedback generated")

    def _validate_replacement_length(self, num_feedback: int, var_to_output: dict[str, any]):
        if self.dst_text_var_name == "":
            # We are replacing the nautTokens with nothing, no need to verify!
            return
        if self.dst_text_var_name:
            replacement_len = len(var_to_output[self.dst_text_var_name])
            if replacement_len != num_feedback:
                print(f"WARNING: {self.dst_text_var_name} is a list of length {replacement_len}, but there are "
                      f"{num_feedback} feedback")

    # This method replaces the variables in the description template with the actual value for the ith feedback.
    def _inject_desc_vars(self, desc_vars: list[str], desc_template: str, feedback_idx: int,
                          var_to_output: dict[str, any]) -> str:
        desc = desc_template
        for desc_var in desc_vars:
            desc = desc.replace(f"{{{desc_var}[i]}}", str(var_to_output[desc_var][feedback_idx]))
        return desc

    def _calculate_highlight_ranges(self, feedback_idx: int, var_to_output: dict[str, any]) -> \
            tuple[any, list[HighlightRange], list[HighlightRange]]:
        highlight_ranges = []

        if self.src_naut_tokens_var_name:
            src_naut_obj = var_to_output[self.src_naut_tokens_var_name][feedback_idx]
        elif self.src_naut_sentences_var_name:
            src_naut_obj = var_to_output[self.src_naut_sentences_var_name][feedback_idx]
        highlight_ranges.extend(self._calculate_highlight_ranges_for_output(src_naut_obj))

        highlight_ranges_on_select = []
        if self.src_naut_tokens_on_select_var_name:
            highlight_ranges_on_select = self._calculate_highlight_ranges_for_output(
                self.src_naut_tokens_on_select_var_name, feedback_idx, var_to_output)

        return src_naut_obj, highlight_ranges, highlight_ranges_on_select

    def _calculate_dst_text(self, feedback_idx: int, var_to_output: dict[str, any]) -> str | None:
        if not self.dst_text_var_name or self.dst_text_var_name == "":
            # we are handling edge cases here:
            # - return None if there's no dst_text specified (no text transformation in Feedback)
            # - return the empty string if we want to delete the srcNautTokens
            return self.dst_text_var_name

        return var_to_output[self.dst_text_var_name][feedback_idx]

    def _calculate_highlight_ranges_for_output(self, src_naut_obj: any) -> list[HighlightRange]:
        highlight_ranges = []

        if not isinstance(src_naut_obj, list):
            # This feedback only needs to highlight one token/sentence since
            # the object in the list is NOT a list of tokens/sentences
            return [HighlightRange.from_naut_obj(src_naut_obj)]

        for obj_chunk in src_naut_obj:
            if not isinstance(obj_chunk, list):
                # This feedback needs to highlight a list of tokens/sentences
                # that are NOT grouped together by chunks.
                naut_obj = obj_chunk
                highlight_ranges.append(HighlightRange.from_naut_obj(naut_obj))
            else:
                # obj_chunk is a chunk (list) of tokens/sentences to highlight
                highlight_ranges.append(HighlightRange.from_naut_chunk(obj_chunk))
        return highlight_ranges
