from __future__ import annotations

from typing import List, Generator

import stanza
from stanza.models.common.doc import Document, Sentence, Token
from stanza.models.constituency.parse_tree import Tree


# tokens are contiguous pieces of characters that are separated by whitespace/punctuation
# note that hyphens are their own tokens, so hand-made is considered as 3 tokens.
class NautToken:
    verbs = {"VB", "VBD", "VBG", "VBN", "VBP", "VBZ"}
    nouns = {"NN", "NNS", "NNP", "NNPS"}

    def __init__(self, token: Token):
        token.naut_token = self
        self.naut_sent = token.sent.naut_sent if token.sent else None  # reference to the sentence this token is in
        self.token = token
        self.text = token.text
        self.ner = token.ner  # named entity recognition tag

        # In Stanza, there is a further abstraction called a word. This is for
        # languages whose tokens can be comprised of multiple words. In english,
        # there is a one-to-one mapping from tokens to words.
        # But in French, the word "du" comprises 2 words: de, le
        # we don't care about words for now, so here, we
        # save the word's POS tag to our token.
        self._word = self.token.words[0]
        self.pos_tag = self._word.xpos
        self.pos = self._word.pos  # the position of the first character in the token (relative to the start of the doc)

        self.is_verb = self.pos_tag in self.verbs
        self.is_noun = self.pos_tag in self.nouns

    def __repr__(self):
        return str(self.text)

    def __len__(self):
        return self._word.end_char - self._word.start_char

    def start_pos(self):
        return self._word.start_char

    def end_pos(self):
        return self._word.end_char


class NautTree:
    def __init__(self, label: str):
        self.label = label
        self.parent = None
        self.children = []
        self.token = None  # When this NautTree is a leaf node, self.token points to the NautToken that follows this constituency label

    def is_leaf(self):
        return len(self.children) == 0

    def set_token(self, token: NautToken):
        if not self.is_leaf():
            print("WARNING: setting a token to a non-leaf node")
        self.token = token

    def add_child(self, child_tree: NautTree) -> None:
        child_tree.parent = self
        self.children.append(child_tree)

    # the NautTokens that are the leaf nodes of this subtree
    def leaves(self) -> List[NautTree]:
        if self.is_leaf():
            return [self]
        leaves = []
        for child in self.children:
            leaves.extend(child.leaves())
        return leaves

    # returns all tokens under this subtree
    def tokens(self) -> List[NautToken]:
        leaves = self.leaves()
        return [leaf.token for leaf in leaves]

    # a generator for preorder traversal on all nodes of the tree (NautTokens excluded)
    def preorder(self) -> Generator[NautTree, None, None]:
        yield self
        for child in self.children:
            if isinstance(child, NautTree):
                yield from child.preorder()

    def __repr__(self) -> str:
        if self.is_leaf():
            return "({} {})".format(self.label, str(self.token))

        children_repr = " ".join([str(child) for child in self.children])
        return "({} {})".format(self.label, children_repr)


class NautSent:
    def __init__(self, sentence: Sentence):
        sentence.naut_sent = self
        self.sentence = sentence
        self.index = sentence.index
        self.tokens = [NautToken(token) for token in sentence.tokens]
        self.entities = sentence.entities
        self.constituency_tree = self._parse_naut_tree(sentence, self.tokens)
        # TODO: have an array of named entities. I think we extract them from the tokens

    # this deep-copies the stanza constituency tree and converts it to naut trees
    def _parse_naut_tree(self, sentence: Sentence, tokens: List[NautToken]) -> NautTree:
        root: Tree = sentence.constituency
        token_idx = 0
        # the idea is to perform DFS to deep copy the Stanza nodes into NautTree Nodes
        root_parent = NautTree("dummy parent")
        stack = [(root, root_parent)]

        while stack:
            stanza_nd, naut_parent = stack.pop()
            if stanza_nd.is_leaf():
                # We want the leaf nodes of the NautTree to reference a NautToken
                text = stanza_nd.label
                if text != tokens[token_idx].text:  # validate that the leaf node is the ith NautToken
                    print("WARNING: the NautToken text mismatches from the constituency leaf text")
                naut_token = tokens[token_idx]
                token_idx += 1
                naut_parent.set_token(naut_token)
                continue
            naut_nd = NautTree(stanza_nd.label)
            naut_parent.add_child(naut_nd)

            # Append this node's children to the stack
            # Note: we append in reverse order since we want to visit
            # the child nodes from left to right (so we traverse the leaf
            # nodes in chronological order)
            for nxt in range(len(stanza_nd.children) - 1, -1, -1):
                child = stanza_nd.children[nxt]
                stack.append((child, naut_nd))

        naut_root = root_parent.children[0]
        naut_root.parent = None  # remove the pointer to the dummy parent
        return naut_root

    def __repr__(self):
        return " ".join([str(token) for token in self.tokens])

    def num_chars(self):
        return len(str(self))


class NautDoc:
    def __init__(self, doc: Document):
        doc.naut_doc = self
        self.doc = doc
        self.sentences = [NautSent(sent) for sent in doc.sentences]
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
