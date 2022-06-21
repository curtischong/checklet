from typing import List

from core.converters.input.naut_parser import NautSentence, NautToken

tokens_to_trim = {"CC", ",", "."}  # helps us trim excess tokens


# We define clauses as
def extract_verb_clauses_task(sentence: NautSentence) -> List[NautToken]:
    clauses = []
    cur_clause = []
    cur_clause_has_noun = False

    def is_valid_clause():
        return len(cur_clause) > 1 and cur_clause_has_noun

    def rtrim_excess_tokens():
        while cur_clause and cur_clause[-1].pos_tag in tokens_to_trim:
            cur_clause.pop()

    # TODO: consider splitting on conjunctions
    # TODO: Try to find false positives with the comma
    for token in sentence.tokens:
        if token.is_noun:
            cur_clause_has_noun = True
        elif token.is_verb or token.text == ",":
            # start a new clause
            rtrim_excess_tokens()
            if is_valid_clause():
                clauses.append(cur_clause)
            cur_clause = []
            cur_clause_has_noun = False
            if token.text == ",":
                # since we are splitting on ',' we don't want it
                # to be the first token in the clause
                continue
        cur_clause.append(token)
    rtrim_excess_tokens()
    if is_valid_clause():
        clauses.append(cur_clause)
    return clauses
