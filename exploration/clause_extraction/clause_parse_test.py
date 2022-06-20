# https://stackoverflow.com/questions/65227103/clause-extraction-long-sentence-segmentation-in-python


import clause_extraction_via_spacy

en = clause_extraction_via_spacy.load('en_core_web_sm')

# text = "This all encompassing experience wore off for a moment and in that moment, my awareness came gasping to the surface of the hallucination and I was able to consider momentarily that I had killed myself by taking an outrageous dose of an online drug and this was the most pathetic death experience of all time."
text = "Automated inserting and categorizing 20k+ emails from over 200 clients in a CRM by creating an email monitoring REST API using Express, and deployed the service on Azure Cloud with Docker"
# text = "he plays cricket but does not play hockey."

doc = en(text)

seen = set()  # keep track of covered words

chunks = []
for sent in doc.sents:
    # the labels can be found at https://spacy.io/models/en#en_core_web_sm-labels
    heads = [cc for cc in sent.root.children if cc.dep_ == 'conj']

    for head in heads:
        words = [ww for ww in head.subtree]
        for word in words:
            seen.add(word)
        chunk = (' '.join([ww.text for ww in words]))
        chunks.append((head.i, chunk))

    unseen = [ww for ww in sent if ww not in seen]
    chunk = ' '.join([ww.text for ww in unseen])
    chunks.append((sent.root.i, chunk))

chunks = sorted(chunks, key=lambda x: x[0])

for ii, chunk in chunks:
    print(chunk, end="\n\n")
