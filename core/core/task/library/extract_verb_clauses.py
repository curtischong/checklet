from typing import List

from core.converters.naut_parser import NautSentence, NautWord

words_to_trim = {"CC", ",", "."}  # helps us trim excess words


# We define clauses as
def extract_verb_clauses_task(sentence: NautSentence) -> List[NautWord]:
    clauses = []
    cur_clause = []
    cur_clause_has_noun = False

    def is_valid_clause():
        return len(cur_clause) > 1 and cur_clause_has_noun

    def rtrim_excess_words():
        while cur_clause and cur_clause[-1].pos_tag in words_to_trim:
            cur_clause.pop()

    # TODO: consider splitting on conjunctions
    # TODO: Try to find false positives with the comma
    for word in sentence.words:
        if word.is_noun:
            cur_clause_has_noun = True
        elif word.is_verb or word.text == ",":
            # start a new clause
            rtrim_excess_words()
            if is_valid_clause():
                clauses.append(cur_clause)
            cur_clause = []
            cur_clause_has_noun = False
            if word.text == ",":
                # since we are splitting on ',' we don't want it
                # to be the first word in the clause
                continue
        cur_clause.append(word)
    rtrim_excess_words()
    if is_valid_clause():
        clauses.append(cur_clause)
    return clauses
