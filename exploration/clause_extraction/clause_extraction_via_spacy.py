import spacy

en = spacy.load('en_core_web_md')

# text = "This all encompassing experience wore off for a moment and in that moment, my awareness came gasping to the surface of the hallucination and I was able to consider momentarily that I had killed myself by taking an outrageous dose of an online drug and this was the most pathetic death experience of all time."
text = "Automated inserting and categorizing 20k+ emails from over 200 clients in a CRM by creating an email monitoring REST API using Express, and deployed the service on Azure Cloud with Docker"
# text = "he plays cricket but does not play hockey."

doc = en(text)

clauses = []
for sent in doc.sents:
    cur_clause = []
    for token in sent:
        print(token.text, token.dep_)
        if token.dep_ in ["cc", "adp", "prep"]:
            clauses.append(cur_clause)
            cur_clause = []
            continue
        cur_clause.append(token.text)
    clauses.append(cur_clause)
print(clauses)
