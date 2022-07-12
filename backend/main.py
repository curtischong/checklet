# Copyright 2015 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import datetime
import os
import traceback

from flask import Flask, request
from flask_cors import CORS

from core.converters.output.resume_converter import get_json_friendly
from core.engine.engine import Engine, EngineRequest

print("Server started on " +
      datetime.datetime.now().strftime("%I:%M%p on %B %d, %Y"), flush=True)

app = Flask(__name__)
CORS(app)

engine_config = {}

engine = Engine(engine_config)


def handle_request(user_input: str):
    global engine
    if engine is None:
        raise Exception("Engine not loaded")
    new_request = EngineRequest(user_input, "resume")
    return engine.handle_request(new_request)


@app.route('/')
def hello():
    """Return a friendly HTTP greeting."""
    return 'Nautilus.'


@app.route('/resumes/feedback', methods=['POST'])
def resume_feedback():
    data = request.json
    feedback = []
    try:
        feedback = handle_request(data["text"])
        feedback = get_json_friendly(feedback)
    except Exception as e:
        print("Error while calling engine")
        print(e)
        traceback.print_exc()
        feedback = {
            "error": "Could not compute"
        }

    response = {
        "inputText": data["text"],
        "feedback": feedback
    }

    return response


@app.route('/structure/suggestions', methods=['POST'])
def structure_suggestions():
    # TODO: ideal structure defined by heuristic
    # data = request.json
    # sections = data["structure"]
    return {
        "structure": ["Skills", "Work Experience", "Volunteering", "Awards", "Education"]
    }


def create_app():
    return app


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
