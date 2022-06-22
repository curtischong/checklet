import stanza
from stanza.models.common.doc import Document, Sentence, Token


# tokens are contiguous pieces of characters that are separated by whitespace/punctuation
# note that hyphens are their own tokens, so hand-made is considered as 3 tokens.
class NautToken:
    verbs = {"VB", "VBD", "VBG", "VBN", "VBP", "VBZ"}
    nouns = {"NN", "NNS", "NNP", "NNPS"}

    def __init__(self, token: Token):
        token.naut_token = self
        self.token = token
        self.text = token.text
        self.ner = token.ner  # named entity recognition tag

        # In Stanza, there is a further abstraction called a word. This is for
        # languages whose tokens can be comprised of multiple words. In english,
        # there is a one-to-one mapping from tokens to words.
        # But in French, the word "du" comprises 2 words: de, le
        # we don't care about words for now, so here, we
        # save the word's POS tag to our token.
        self.word = self.token.words[0]
        self.pos_tag = self.word.xpos
        self.pos = self.word.pos  # the position of the first character in the token (relative to the start of the doc)

        self.is_verb = self.pos_tag in self.verbs
        self.is_noun = self.pos_tag in self.nouns

    def __repr__(self):
        return str(self.text)


# TODO: consider storing the tokens as a constituent tree
class NautSentence:
    def __init__(self, sentence: Sentence):
        sentence.naut_sentence = self
        self.sentence = sentence
        self.tokens = [NautToken(token) for token in sentence.tokens]
        self.entities = sentence.entities
        # TODO: have an array of named entities. I think we extract them from the tokens

    def __repr__(self):
        return str(self.tokens)


class NautDoc:
    def __init__(self, doc: Document):
        doc.naut_doc = self
        self.doc = doc
        self.sentences = [NautSentence(sent) for sent in doc.sentences]
        self.tokens = []
        for sentence in self.sentences:
            self.tokens.extend(sentence.tokens)

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
