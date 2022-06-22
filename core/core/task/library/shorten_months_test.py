from core.converters.input.naut_parser import NautParser
from core.task.library.shorten_months import shorten_months

inputs = [
    "Bob went to the farm in January",
    "Sally was born in may",
    "The cat jumped over the fall in OCTOBER"
]

def run_test():
    for input in inputs:
        doc = NautParser().parse(input)
        res = shorten_months(doc.sentences[0])
        print(res)

if __name__ == "__main__":
    run_test()