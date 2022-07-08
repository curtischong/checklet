from core.converters.input.naut_parser import NautToken, NautSent


# TODO: remove this task once the yaml feedback becomes more versitile
# this task helps the split_long_sentences check by outputting the results
# in a format that is easy for the current FeedbackGenerator to understand
def format_clauses_into_feedback(clauses: list[str]):
    return "\"" + "\", \"".join(clauses) + "\""


def split_long_sentence_feedback_task(clauses_in_long_sentences: list[list[list[NautToken]]]) -> tuple[
    list[str], list[NautSent], list[list[list[NautToken]]]]:
    long_desc = []
    for sentence_clauses in clauses_in_long_sentences:
        clauses = []
        for clause in sentence_clauses:
            clause_as_str = " ".join([str(token) for token in clause])
            clauses.append(clause_as_str)
        n = len(clauses)
        # TODO: make this midpoint logic more robust. Since a point may have 4 clauses
        # but the first 2 clauses may have 2 words each, whereas the last 2 have many more
        # we may also want to consider intelligently grouping the clauses based on
        # semantic relevance between the clauses  (sentence to vec maybe?)
        mid = n // 2
        first_half = clauses[:mid]
        second_half = clauses[mid:]
        first_half_str = format_clauses_into_feedback(first_half)
        second_half_str = format_clauses_into_feedback(second_half)
        long_desc.append("""Consider splitting the clauses to the following:

    - {}
    - {}
        """.format(first_half_str, second_half_str))

    sentences_to_highlight = []
    for sentence_clauses in clauses_in_long_sentences:
        sentences_to_highlight.append(sentence_clauses[0][0].naut_sent)

    tokens_to_highlight_on_select = clauses_in_long_sentences
    return long_desc, sentences_to_highlight, tokens_to_highlight_on_selects
