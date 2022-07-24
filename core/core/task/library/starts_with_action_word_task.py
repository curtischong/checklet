from core.converters.input.naut_parser import NautDoc, NautToken

# Returns all first words that are not a verb
def starts_with_action_word_task(first_words: list[NautToken]) -> list[NautToken]:
    return [word for word in first_words if not word.is_verb]
