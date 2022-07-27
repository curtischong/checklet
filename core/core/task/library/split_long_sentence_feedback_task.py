from core.converters.input.naut_parser import NautToken, NautSent


# TODO: remove this task once the yaml feedback becomes more versitile
# this task helps the split_long_sentences check by outputting the results
# in a format that is easy for the current FeedbackGenerator to understand
def format_clauses_into_feedback(clauses: list[str]):
    return "\"" + "\", \"".join(clauses) + "\""


def sentence_of_clause(clauses_of_sentence: list[list[NautToken]]) -> NautSent:
    first_clause = clauses_of_sentence[0]
    first_token = first_clause[0]
    return first_token.naut_sent


def split_long_sentence_feedback_task(clauses_in_long_sentences: list[list[list[NautToken]]]) -> \
        tuple[list[str], list[NautSent]]:
    clause_lists = []
    for sentence_clauses in clauses_in_long_sentences:
        sentence_text = str(sentence_of_clause(sentence_clauses))
        clauses_text = []
        for clause in sentence_clauses:
            clause_start = clause[0].start_pos
            clause_end = clause[-1].end_pos
            clause_text = sentence_text[clause_start:clause_end]
            clauses_text.append(f"- {clause_text}")
        clause_lists.append("\n".join(clauses_text))

    sentences_to_highlight = []
    for sentence_clauses in clauses_in_long_sentences:
        sentences_to_highlight.append(sentence_clauses[0][0].naut_sent)

    return clause_lists, sentences_to_highlight
