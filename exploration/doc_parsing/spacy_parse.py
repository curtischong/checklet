# https://stackoverflow.com/questions/49371180/how-to-get-a-parse-nlp-tree-object-from-bracketed-parse-string-with-nltk-or-spac
import spacy

nlp = spacy.load('en_core_web_md')

from spacy.language import Language, Doc
from spacy.tokens import Token
from exploration.sample_resumes import mann_resume


@Language.component("custom_sentencizer")
def custom_sentencizer(doc: Doc):
    splitters = ["\n", "."]
    for i, token in enumerate(doc[:-2]):
        token: Token = token
        # Define sentence start if pipe + titlecase token
        next_token: Token = doc[i + 1]
        # we're using text[0] cause there was an edge case where the token was "\n "
        if token.text[0] in splitters and not next_token.text.islower():
            doc[i + 1].is_sent_start = True
        else:
            # Explicitly set sentence start to False otherwise, to tell
            # the parser to leave those tokens alone
            doc[i + 1].is_sent_start = False
    return doc


nlp.add_pipe("custom_sentencizer", before="parser")

sentences = []
doc = nlp(mann_resume)
for sent in doc.sents:
    sentences.append(sent)
tokens = []
for token in doc:
    tokens.append(token)
print(tokens)
