from core.converters.input.naut_parser import NautDoc, NautToken

# Returns all words that does not match the tense
def filter_tense_task(words: list[NautToken], tense: str) -> list[NautToken]:
    return [word for word in words if word.tense != tense]
