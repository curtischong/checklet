import yaml


class Config:
    def __init__(self, config_path: str):
        with open(config_path, 'r') as stream:
            self.config = yaml.safe_load(stream)
