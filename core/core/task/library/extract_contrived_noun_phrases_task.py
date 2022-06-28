from core.converters.input.naut_parser import NautToken, NautDoc


def extract_contrived_noun_phrases_task(naut_doc: NautDoc) -> list[list[NautToken]]:
    contrived_noun_phrases = []
    for sentence in naut_doc.sentences:
        for node in sentence.constituency_tree.preorder():
            # TODO: consider making labels a string constant since we're not sure which POS format we're using
            # Although, we are currently using the treetags one, which is pretty universal
            if node.label == "NP":  # NP = noun phrase
                cur_noun_phrase: list[NautToken] = []
                for child in node.children:
                    # https://www.ling.upenn.edu/courses/Fall_2003/ling001/penn_treebank_pos.html
                    # NN = Noun, singular or mass
                    # https://catalog.ldc.upenn.edu/docs/LDC2007T02/treebank-guidelines-addenda.txt
                    # NML = nominal subconstituents that do not follow the assumed right-branching default structure
                    if child.label in ("NN", "NML"):
                        cur_noun_phrase.extend(child.tokens())
                    else:
                        # we found a child that isn't part of a noun phrase
                        # so push the contrived noun phrase that we have so far if it's long enough
                        if len(cur_noun_phrase) >= 3:
                            contrived_noun_phrases.append(cur_noun_phrase)
                        cur_noun_phrase = []
                if len(cur_noun_phrase) >= 3:
                    contrived_noun_phrases.append(cur_noun_phrase)
    return contrived_noun_phrases
