# Problem: Testing tasks is slow since we need to spin up a NautParser each time
# solution: Run the NautParser in a separate process, then make requests to it
#           when we need to parse text in a Task test. BaseManager allows us
#           to share objects between python processes (in this case the NautParser)

# How to use: run python task_parsing_helper OR (from the root) make serve-naut-parser to start the server!
from multiprocessing.managers import BaseManager

from core.converters.input.naut_parser import NautParser, NautDoc, NautSent


class NautParserManager(BaseManager):
    pass


SERVER_ADDRESS = ('', 42952)
AUTHKEY = b'buhr'


def _start_server() -> None:
    naut_parser = NautParser()
    NautParserManager.register('get_naut_parser', callable=lambda: naut_parser)
    m = NautParserManager(address=SERVER_ADDRESS, authkey=AUTHKEY)
    s = m.get_server()
    print("[TaskParsingHelperServer] serving naut_parser!")
    s.serve_forever()


# serve the naut parser when this file is run by a new process
if __name__ == "__main__":
    _start_server()


# This is a class that abstracts away the connection logic to the server
class TaskParsingHelper:
    def __init__(self):
        NautParserManager.register('get_naut_parser')
        manager = NautParserManager(address=SERVER_ADDRESS, authkey=AUTHKEY)
        manager.connect()
        self.naut_parser: NautParser = manager.get_naut_parser()

    def parse_document(self, text: str) -> NautDoc:
        return self.naut_parser.parse(text)

    def to_naut_sent(self, text: str) -> NautSent:
        doc = self.parse_document(text)
        num_sentences = len(doc.sentences)
        if num_sentences != 1:
            print(f"[TaskParsingHelper] WARNING: found {num_sentences} sentences when parsing {text}")
        return doc.sentences[0]
