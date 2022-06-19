import yaml


class Tokenizer:
    def __init__(self, config):
        self.model_location = config["model_location"]


class Config:
    def __init__(self, config_path):
        with open(config_path, 'r') as stream:
            self.config = yaml.safe_load(stream)

    def tokenizer(self) -> Tokenizer:
        return Tokenizer(self.config)
