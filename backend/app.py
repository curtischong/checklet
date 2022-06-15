import datetime
import json
from flask import Flask, request
from flask_cors import CORS

from config import Config
from parse import Parser

print("Server started on " +
      datetime.datetime.now().strftime("%I:%M%p on %B %d, %Y"), flush=True)
app = Flask(__name__)

config = Config("config.yaml")
parser = Parser(config)


@app.route('/tokenize', methods=['GET'])
def tokenize():
    document = request.args.get('document')
    return str(parser.parse(document))


@app.route('/structure/suggestions', methods=['POST'])
def structure_suggestions():
    # TODO: ideal structure defined by heuristic
    # data = request.json
    # sections = data["structure"]
    return {
        "structure": ["Skills", "Work Experience", "Volunteering", "Awards", "Education"]
    }


# Please keep the following lines at the very bottom of the script
if __name__ == "__main__":
    print("running in development", flush=True)
    CORS(app)
    app.run(host='0.0.0.0', port="5000")
else:
    print("running in production", flush=True)
