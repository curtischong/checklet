from naut_parser import NautParser


def run_test():
    np = NautParser()
    doc = np.parse("this is a really long sentence")
    # doc = np.parse(
    #    "Use yield from with your recursive call, otherwise you are just ignoring the result of the recursive call.")
    constituency_tree = doc.sentences[0].constituency_tree
    print(constituency_tree.leaves())
    print(constituency_tree.tokens())
    for node in constituency_tree.preorder():
        print(node.label)


if __name__ == "__main__":
    run_test()
