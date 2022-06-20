import json

from nltk.tree import ParentedTree, Tree
from pycorenlp import *


class ExtractClausesTask:
    def __init__(self):
        # from https://github.com/rahulkg31/sentence-to-clauses/blob/master/sent_to_clauses.py
        # start the connection here
        self.nlp = StanfordCoreNLP("http://0.0.0.0:9000/")

    def _is_leaf(self, tree: ParentedTree):
        return len(list(tree.subtrees())) == 1

    def _children_of(self, parent_node: ParentedTree):
        return lambda x: x.parent() == parent_node

    # def _first_ancestor(self, node: ParentedTree):
    #     return ptree[tree_location[:-2]].label()

    def process(self, a: int) -> int:
        # sent = "he plays cricket but does not play hockey."
        # sent = "Automated inserting and categorizing 20k+ emails from over 200 clients in a CRM by creating an email monitoring REST API using Express, and deployed the service on Azure Cloud with Docker"
        # sent = "Developed a CI/CD system with Jenkins to automatically test, build, and publish a Scikit-Learn based ML service, reducing test failures by 80% and decreasing deployment time by 50%"
        # sent = "Implemented a host-device communications system in Rust and Node.js to increase data transfer speed by 7x compared to previous methods, enabling the addition of new types of sensors"

        # sent = "Selected a storage engine by creating a benchmark testing suite tracking latency and memory per operation, as well as total disk usage for various key value stores."
        sent = "Built a Go service and client CLI to export build and deployment metrics from all 600+ company CI/CD pipelines to Prometheus and created Grafana dashboards for data visualization"
        # sent = "Established a cron testing service in Spring Boot with integrations to databases and multiple platform services to support overall system validation scenarios"
        # sent = "Designed and built a new React web application to amalgamate three core client workflows into one tool, with emphasis on ease of use, and improved functionality"

        parser = self.nlp.annotate(sent, properties={"annotators": "parse", "outputFormat": "json"})
        parser = json.loads(parser)
        # print(parser["sentences"][0]["parse"])
        root = ParentedTree.fromstring(parser["sentences"][0]["parse"])
        clauses = []
        cur_clause = []  # token, label
        verbs = {"VB", "VBD", "VBG", "VBN", "VBP", "VBZ"}
        nouns = {"NN", "NNS", "NNP", "NNPS"}
        cur_clause_has_noun = False

        # TODO: trim excess tokens
        to_trim = {"CC", ",", "."}

        def valid_clause():
            return len(cur_clause) > 1 and cur_clause_has_noun

        def add_clause():
            clause_str = " ".join([x[0] for x in cur_clause])
            clauses.append(clause_str)

        def trim_excess_tokens():
            while cur_clause and cur_clause[-1][1] in to_trim:
                cur_clause.pop()

        def dfs(cur: ParentedTree):
            nonlocal clauses, cur_clause, cur_clause_has_noun
            for nxt in cur:
                if not isinstance(nxt, Tree):
                    # nxt is a leaf node
                    cur_label = cur.label()
                    if cur_label in nouns:
                        cur_clause_has_noun = True
                    elif cur_label in verbs or cur_label in [",", "."]:
                        # this token is a verb, we are now starting a new clause
                        trim_excess_tokens()
                        if valid_clause():
                            add_clause()
                        cur_clause = []
                        cur_clause_has_noun = False
                        if cur_label in [",", "."]:
                            # we don't want cur_label to be the start of the clause
                            break

                    cur_clause.append((nxt, cur_label))
                else:
                    dfs(nxt)

        dfs(root)
        trim_excess_tokens()
        if valid_clause():
            add_clause()
        for clause in clauses:
            print(clause)
        return a


task = ExtractClausesTask()
task.process(3)

"""
if t.height() == 2:  # child nodes
    print
    t.parent()
    return

for child in t:
    traverse(child)
"""
