import json

from core.converters.output.resume_converter import get_json_friendly
from core.engine.engine import Engine, EngineRequest


def run_test():
    # text = "Selected our storage engine by creating our benchmark testing suite tracking latency and memory per operation, as well as total disk usage for various key value stores."
    # text = "Optimized user creation generation using ASP.Net and React, reducing wait time by 80%"
    text = "made our many engines faster on january 23"
    # text = "Bachelor of Applied Science Honours"

    engine_config = {}
    engine = Engine(engine_config, use_task_parsing_helper=True)
    print("engine started!")

    new_request = EngineRequest(text, "resume")
    response = engine.handle_request(new_request)
    for feedback in get_json_friendly(response):
        print("__________________________________")
        print(json.dumps(feedback, indent=2))


if __name__ == "__main__":
    run_test()
