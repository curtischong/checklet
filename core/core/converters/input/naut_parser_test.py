from naut_parser import NautParser

np = NautParser()
doc = np.parse("this is a really long sentence.")
print(doc.words)
