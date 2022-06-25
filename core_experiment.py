from core.converters.output.resume_converter import get_json_friendly
from core.engine.engine import Engine, EngineRequest

text = "Selected our storage engine by creating our benchmark testing suite tracking latency and memory per operation, as well as total disk usage for various key value stores."

engine_config = {}
engine = Engine(engine_config)

new_request = EngineRequest(text, "resume")
response = engine.handle_request(new_request)
print(get_json_friendly(response))
