from core.converters.input.naut_parser import NautDoc, NautSent

# filters sentences by the starting word
def filter_sentences_by_start_task(naut_doc: NautDoc, start_words: set[str]) -> list[NautSent]:
    filtered_sentences = []

    for sentence in naut_doc.sentences:
       if len(sentence.tokens) > 0 and sentence.tokens[0].text.lower() in start_words:
             filtered_sentences.append(sentence)

    return filtered_sentences
