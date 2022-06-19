from core.engine.engine import Engine, EngineRequest
from core.lib.config import Config
import os

engine = None

def create_engine():
    global engine
    if engine == None:
        __location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
        config = Config(os.path.join(__location__, "engine_config.yaml"))
        tokenizer = config.tokenizer()
        engine_config = {
            "tokenizer": tokenizer
        }
        engine = Engine(engine_config)

def handle_request(user_input: str):
    if engine is None:
        raise Exception("Engine not loaded")
    new_request = EngineRequest(user_input, "resume")
    return engine.handle_request(new_request)
