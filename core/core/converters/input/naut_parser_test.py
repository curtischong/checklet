from core.converters.input.naut_parser import NautParser


def run_test():
    text = """ Automated document processing through writing Powershell scripts to run SQL queries and exporting to CSV.
    • Implemented Python machine learning model in T-SQL query to predict road speeds based on date and time with over 90% accuracy.
    • Created analytics dashboard in Angular and .NET Core for seat booking application hosted on AWS with CI/CD using Azure DevOps."""
    np = NautParser()
    # doc = np.parse("this is a really long sentence")
    doc = np.parse(text)
    # print(doc.sentences[0].root.preorder_dependency_tree_repr())
    # print(doc.sentences[0].root.inorder_dependency_tree_repr())
    print(doc.sentences)


if __name__ == "__main__":
    run_test()
