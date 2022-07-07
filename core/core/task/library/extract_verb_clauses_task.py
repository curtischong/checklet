from core.converters.input.naut_parser import NautDoc, NautSent, NautToken


# This task extracts the verb clauses for each Task
# Verb clauses are "the things that are going on in this sentence"
# they are called verb clauses because they always start with a verb.

def is_valid_clause(cur_clause: list[NautToken], cur_clause_has_noun: bool):
    return len(cur_clause) > 1 and cur_clause_has_noun


tokens_to_rtrim = {"CC", ",", "."}  # helps us trim excess tokens


# rtrim the clauses to remove conjunctions (such as "and") and unwanted punctuation (like commas)
def rtrim_excess_tokens(cur_clause: list[NautToken]):
    while cur_clause and cur_clause[-1].pos_tag in tokens_to_rtrim:
        cur_clause.pop()


# This method works by looking at the sentence, then splitting the
# tokens by verbs. The verb clauses are the tokens in between these splits.
# Note: A valid verb clause must also contain a noun
def extract_verb_clauses_for_sentence(sentence: NautSent) -> list[list[NautToken]]:
    clauses = []
    cur_clause = []
    cur_clause_has_noun = False

    # TODO: consider splitting on conjunctions
    # TODO: Try to find false positives with the comma
    for token in sentence.tokens:
        if token.is_noun:
            cur_clause_has_noun = True
        elif token.is_verb:
            # start a new clause
            rtrim_excess_tokens(cur_clause)
            if is_valid_clause(cur_clause, cur_clause_has_noun):
                clauses.append(cur_clause)
            cur_clause = []
            cur_clause_has_noun = False
        cur_clause.append(token)
    rtrim_excess_tokens(cur_clause)
    if is_valid_clause(cur_clause, cur_clause_has_noun):
        clauses.append(cur_clause)
    return clauses


def extract_verb_clauses_task(naut_doc: NautDoc) -> list[list[list[NautToken]]]:
    verb_clauses_in_sentences = []
    for sentence in naut_doc.sentences:
        verb_clauses_in_sentences.append(extract_verb_clauses_for_sentence(sentence))
    return verb_clauses_in_sentences
