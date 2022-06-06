import yaml


class Config:
    def __init__(self, config_location):
        with open(config_location, 'r') as stream:
            data = yaml.safe_load(stream)
            self.spacy_model = data["spacy_model"]
