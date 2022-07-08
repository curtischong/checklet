# Problem: Testing tasks is slow since we need to spin up a NautParser each time
# solution: Run the NautParser in a separate process, then make requests to it
#           when we need to parse text in a Task test. BaseManager allows us
#           to share objects between python processes (in this case the NautParser)

# How to use: run python task_parsing_helper OR (from the root) make serve-naut-parser to start the server!
from multiprocessing.managers import BaseManager

from core.converters.input.naut_parser import NautParser, NautDoc, NautSent, NautToken
from core.models.NautEmbeddings import NautEmbeddings


class NautParserManager(BaseManager):
    pass

# If you move or rename SERVER_ADDRESS, please update `run_core.sh`
SERVER_ADDRESS = ('', 42952)
AUTHKEY = b'buhr'


def _start_server() -> None:
    naut_parser = NautParser()
    naut_embeddings = NautEmbeddings()
    NautParserManager.register('get_naut_parser', callable=lambda: naut_parser)
    NautParserManager.register('get_naut_embeddings', callable=lambda: naut_embeddings)
    m = NautParserManager(address=SERVER_ADDRESS, authkey=AUTHKEY)
    s = m.get_server()
    print("[TaskParsingHelperServer] serving dependencies!")
    s.serve_forever()


# serve the naut parser when this file is run by a new process
if __name__ == "__main__":
    _start_server()


# This is a class that abstracts away the connection logic to the server
# NOTE: This only exposes functions not attributes. You should NOT query for a Class' attributes
# since it is typically a large dataset (we don't want to serve large datasets over a connection!)
# So please just call the public methods of these served Classes and offload computation to the classes.
class TaskParsingHelper:
    def __init__(self):
        NautParserManager.register('get_naut_parser')
        NautParserManager.register('get_naut_embeddings')
        manager = NautParserManager(address=SERVER_ADDRESS, authkey=AUTHKEY)
        try:
            manager.connect()
        except ConnectionRefusedError:
            raise ConnectionRefusedError(
                "[TaskParsingHelper] Cannot connect to TaskParsingHelper server. Try running make serve-naut-parser"
                " in a new terminal to serve it!")
        self.naut_parser: NautParser = manager.get_naut_parser()
        self.naut_embeddings: NautEmbeddings = manager.get_naut_embeddings()

    def parse_document(self, text: str) -> NautDoc:
        return self.naut_parser.parse(text)

    def to_naut_sent(self, text: str) -> NautSent:
        doc = self.parse_document(text)
        num_sentences = len(doc.sentences)
        if num_sentences != 1:
            print(f"[TaskParsingHelper] WARNING: found {num_sentences} sentences when parsing {text}")
        return doc.sentences[0]

    def to_naut_tokens(self, text: str) -> list[NautToken]:
        doc = self.parse_document(text)
        return doc.tokens
