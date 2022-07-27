from core.converters.input.naut_parser import NautDoc, NautSent

def isXNum(text):
    return text[-1].lower() == "x" and text[:-1].isdigit()

def detect_impact_task(naut_doc: NautDoc) -> list[NautSent]:
    sentences_to_highlight = []

    for sentence in naut_doc.sentences:
        for token in sentence.tokens:
            if token.pos == "NUM" or isXNum(token.text):
                break
        else:
            sentences_to_highlight.append(sentence)

    return sentences_to_highlight
