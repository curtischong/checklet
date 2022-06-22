from typing import List

from core.converters.input.naut_parser import NautSentence, NautToken

MONTHS = {"JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"}

def shorten_months(sentence: NautSentence) -> List[NautToken]:
    shortened_month_sentence = []
    for token in sentence.tokens:
        if token.text.upper() in MONTHS:
            # Shorten month to 3 characters, with first character capitalized
            token.text = token.text[0:3].capitalize()
        shortened_month_sentence.append(token)
    return shortened_month_sentence