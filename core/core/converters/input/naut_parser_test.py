from naut_parser import NautParser

def run_test():
    np = NautParser()
    doc = np.parse("this is a really long sentence.")
    print(doc.words)

if __name__ == "__main__":
    run_test()