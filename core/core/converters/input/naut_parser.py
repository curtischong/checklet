from __future__ import annotations

import re
from enum import Enum
from typing import Generator

import spacy
from spacy.language import Language, Doc
from spacy.tokens import Token, Span


# tokens are contiguous pieces of characters that are separated by whitespace/punctuation
# note that hyphens are their own tokens, so hand-made is considered as 3 tokens.
class NautToken:
    verbs = {"VERB"}
    nouns = {"NOUN", "PROPN"}

    def __init__(self, token: Token, naut_sent: NautSent):
        self.naut_sent = naut_sent
        self.text = token.text
        self.ent_type = NautEntityType.from_str(token.ent_type_)  # The type of named entity

        morph = token.morph
        tense = morph.get("Tense")
        self.tense = tense[0].lower() if len(tense) > 0 else ""

        # TODO: consider making POS a constant since we're not sure which POS format we're using
        # Although, we are currently using the treetags one, which is pretty universal
        # performance: store the pos as an enum rather than a str
        # list of Spacy POS tags: https://machinelearningknowledge.ai/tutorial-on-spacy-part-of-speech-pos-tagging/
        self.pos = token.pos_  # point of speech tag
        self.is_verb = self.pos in self.verbs
        self.is_noun = self.pos in self.nouns

        # Spacy's dependency tree: https://spacy.io/usage/linguistic-features#dependency-parse
        # The token's parent (in the dependency tree) is parsed after all NautTokens are created
        self.parent_dep: NautToken | None = None

        # Edges to token's children in the dependency tree.
        # Each edge is in the form: (<child NautToken>, <dependency label>)
        # performance: store the <dependency label> as a hash rather than a str
        self.children_dep: list[tuple[NautToken, str]] = []
        self.left_deps: list[NautToken] = []
        self.right_deps: list[NautToken] = []

        # the location of the first character relative to the document
        self.start_pos: int = token.idx
        self.end_pos: int = token.idx + len(self)

    def __repr__(self):
        return str(self.text)

    def __len__(self):
        return len(self.text)

    def is_leaf_in_dep_tree(self) -> bool:
        return len(self.left_deps) + len(self.right_deps) == 0

    # a generator for preorder traversal on all nodes in the dependency tree
    def preorder_dep(self) -> Generator[NautToken, None, None]:
        yield self
        for child, _ in self.children_dep:
            yield from child.preorder_dep()

    def preorder_dependency_tree_repr(self) -> str:
        if self.is_leaf_in_dep_tree():
            return f"({self})"

        children_repr = []
        for child, label in self.children_dep:
            children_repr.append(f"{label}:{child.preorder_dependency_tree_repr()}")
        children_repr = " ".join(children_repr)
        return f"({self} {children_repr})"

    def inorder_dependency_tree_repr(self) -> str:
        if self.is_leaf_in_dep_tree():
            return f"({self})"

        left_repr = []
        for child in self.left_deps:
            left_repr.append(child.inorder_dependency_tree_repr())
        right_repr = []
        for child in self.right_deps:
            right_repr.append(child.inorder_dependency_tree_repr())
        return f"({' '.join(left_repr)} {self} {' '.join(right_repr)})"

    def set_child_dep(self, child_naut_token: NautToken, dep_label: str) -> None:
        child_naut_token.parent_dep = self
        self.children_dep.append((child_naut_token, dep_label))


class NautEntityType(Enum):
    # @formatter:off
    PERSON = 1          # People, including fictional.
    NORP = 2            # Nationalities or religious or political groups.
    FAC = 3             # Buildings, airports, highways, bridges, etc.
    ORG = 4             # Companies, agencies, institutions, etc.
    GPE = 5             # Countries, cities, states.
    LOC = 6             # Non-GPE locations, mountain ranges, bodies of water.
    PRODUCT = 7         # Objects, vehicles, foods, etc. (Not services.)
    EVENT = 8           # Named hurricanes, battles, wars, sports events, etc.
    WORK_OF_ART = 9     # Titles of books, songs, etc.
    LAW = 10            # Named documents made into laws.
    LANGUAGE = 11       # Any named language.
    DATE = 12           # Absolute or relative dates or periods.
    TIME = 13           # Times smaller than a day.
    PERCENT = 14        # Percentage, including ”%“.
    MONEY = 15          # Monetary values, including unit.
    QUANTITY = 16       # Measurements, as of weight or distance.
    ORDINAL = 17        # “first”, “second”, etc.
    CARDINAL = 18       # Numerals that do not fall under another type.
    NONE = 19
    UNKNOWN = 20
    # @formatter:on

    @staticmethod
    def from_str(label: str):
        if label == "":
            return NautEntityType.NONE

        try:
            return NautEntityType[label]
        except KeyError as e:
            print(f"Cannot map NER label {label} to an enum")
            return NautEntityType.UNKNOWN


# entities from named entity recognition
class NautEntity:
    def __init__(self, tokens: list[NautToken], dep: str):
        self.tokens = tokens
        self.type = NautEntityType.from_str(dep)

    def __repr__(self):
        tokens_repr = " ".join([str(token) for token in self.tokens])
        return f"{self.type}: {tokens_repr}"


class NautSent:
    FILTER_POS = {"PUNCT", "SYM", "X", "SPACE"}

    def __init__(self, sentence: Span, sent_idx: int):
        self.idx = sent_idx
        self.token_idx_to_naut_token, self.raw_tokens = self._parse_tokens(sentence)
        self.tokens = self.raw_tokens
        if len(self.tokens) > 0:
            first_token = self.tokens[0]
            if first_token.pos in self.FILTER_POS:
                self.tokens.pop(0)
        self.text = sentence.text

        # the root of the dependency tree
        self.root = self._parse_dependency_tree(sentence.root, self)
        self._repr = sentence.__repr__()

        self.entities = self._parse_entities(sentence)

    def _parse_tokens(self, sentence: Span) -> tuple[dict, list[NautToken]]:
        naut_tokens = []
        token_idx_to_naut_token = {}
        for token in sentence:
            naut_token = NautToken(token, self)

            # populate the token_idx_to_naut_token so we can find
            # the naut_token that the spacy token references
            token_idx_to_naut_token[token.idx] = naut_token
            naut_tokens.append(naut_token)
        return token_idx_to_naut_token, naut_tokens

    def _parse_entities(self, sentence: Span) -> list[NautEntity]:
        naut_entities = []
        for entity in sentence.ents:
            entity_naut_tokens = [self._get_naut_token(token) for token in entity]
            naut_entities.append(NautEntity(entity_naut_tokens, entity.label_))
        return naut_entities

    def _get_naut_token(self, token: Token) -> NautToken:
        return self.token_idx_to_naut_token[token.idx]

    def _parse_dependency_tree(self, root: Token, naut_sent: NautSent) -> NautToken:
        root_naut_token = self._get_naut_token(root)

        # set the child dependencies for this root
        for child in root.children:
            child_naut_token = self._parse_dependency_tree(child, naut_sent)
            dep_label = child.dep_
            root_naut_token.set_child_dep(child_naut_token, dep_label)

        # set the left dependencies for this root
        for left in root.lefts:
            root_naut_token.left_deps.append(self._get_naut_token(left))

        # set the right dependencies for this root
        for right in root.rights:
            root_naut_token.right_deps.append(self._get_naut_token(right))

        return root_naut_token

    def __repr__(self):
        return self._repr

    def num_chars(self) -> int:
        return len(str(self))


class NautDoc:
    def __init__(self, doc: Doc):
        self.sentences = [NautSent(sent, sent_idx) for sent_idx, sent in enumerate(doc.sents)]
        self.tokens = []
        for sentence in self.sentences:
            self.tokens.extend(sentence.tokens)

    def __repr__(self):
        return str(self.sentences)


# Splits a list of tokens into sentences if there is a newline or a period
@Language.component("newline_sentencizer")
def newline_sentencizer(doc: Doc) -> Doc:
    splitters = ["\n", "."]

    def _text_without_blank_chars(token: Token) -> str:
        return re.sub("[ \t]", "", token.text)

    # iterate to the n-2th element since the smallest length a sentence
    # can be is 2 words (e.g. They waited). if the token at idx i=n-2 is a period,
    # then there are enough tokens to form a sentence with the remaining two tokens.
    for i, token in enumerate(doc[:-2]):
        next_token = doc[i + 1]

        # see if this token is the start of the next sentence
        if (_text_without_blank_chars(token) in splitters and
                not next_token.text.islower()  # we don't look for isupper() since bullet points '-' are not upper
        ):
            doc[i + 1].is_sent_start = True
        else:
            doc[i + 1].is_sent_start = False  # explicitly tell the parser this token isn't sent_start
    return doc


class NautParser:
    def __init__(self):
        self.nlp = spacy.load('en_core_web_lg')
        self.nlp.add_pipe("newline_sentencizer", before="parser")

    def parse(self, text: str) -> NautDoc:
        doc = self.nlp(text)
        return NautDoc(doc)
