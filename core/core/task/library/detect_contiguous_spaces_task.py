from core.converters.input.naut_parser import NautDoc, NautToken


def detect_contiguous_spaces_task(naut_doc: NautDoc) -> list[NautToken]:
    return [token for sentence in naut_doc.sentences for token in sentence.tokens if token.text.isspace()]
