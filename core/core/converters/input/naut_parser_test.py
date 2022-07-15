from naut_parser import NautParser


def run_test():
    np = NautParser()
    # doc = np.parse("this is a really long sentence")
    doc = np.parse("I love using my iPhone when I'm at Github's Paris office")
    print(doc.sentences[0].root.preorder_dependency_tree_repr())
    print(doc.sentences[0].root.inorder_dependency_tree_repr())


if __name__ == "__main__":
    run_test()
