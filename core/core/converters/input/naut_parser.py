import stanza
from stanza.models.common.doc import Document, Sentence, Token, Word

class NautWord():
    verbs = {"VB", "VBD", "VBG", "VBN", "VBP", "VBZ"}
    nouns = {"NN", "NNS", "NNP", "NNPS"}

    def __init__(self, word: Word):
        self.text = word.text
        self.pos_tag = word.xpos

        self.is_verb = self.pos_tag in self.verbs
        self.is_noun = self.pos_tag in self.nouns

    def __repr__(self):
        return str(self.text)


# NautTokens are composed of related words. e.g. Eiffel Tower
class NautToken():
    def __init__(self, token: Token):
        self.words = [NautWord(word) for word in token.words]

    def __repr__(self):
        return str(self.words)


# TODO: consider storing the tokens as a constituent tree
class NautSentence():
    def __init__(self, sentence: Sentence):
        self.sentence = sentence
        self.tokens = [NautToken(token) for token in sentence.tokens]
        self.words = []
        for token in self.tokens:
            self.words.extend(token.words)
        # TODO: have an array of named entities. I think we extract them from the tokens

    def __repr__(self):
        return str(self.tokens)


class NautDoc:
    def __init__(self, doc: Document):
        self.doc = doc
        self.sentences = [NautSentence(sent) for sent in doc.sentences]
        self.words = []
        for sentence in self.sentences:
            self.words.extend(sentence.words)

    def __repr__(self):
        return str(self.sentences)


class NautParser:
    def __init__(self):
        stanza.install_corenlp()
        # Stanza's default tokenizer uses a neural network and although it's generally
        # more accurate, it fails to properly segemnt this sentence:
        # Built a Go server that... (The word Go makes it think that it's the start of a second sentence)
        # To fix this, I enabled the rule-based spacy tokenization. but spacy is less accurate generally
        # https://stanfordnlp.github.io/stanza/tokenize.html#use-spacy-for-fast-tokenization-and-sentence-segmentation
        self.stanza_client = stanza.Pipeline('en', processors={'tokenize': 'spacy'})

    def parse(self, text: str) -> NautDoc:
        doc = self.stanza_client(text)
        return NautDoc(doc)
