import yaml

from core.lib.utils.optional import only_one
from core.type.Type import Type, TYPE_STR, TYPE_LIST, TYPE_DICT


class PipelineDefinitionError(Exception):
    pass


class FeedbackDefinitionError(Exception):
    pass


class PipelineEntryDefinition:
    NAME = "name"
    TASK = "task"
    DEPENDENCIES = "dependencies"
    PARAMS = "params"
    OUTPUTS = "outputs"
    REQUIRED_KEYS = {NAME, TASK, OUTPUTS}
    EXPECTED_TYPES = {
        NAME: TYPE_STR,
        TASK: TYPE_STR,
        DEPENDENCIES: TYPE_LIST,
        PARAMS: TYPE_DICT,
        OUTPUTS: TYPE_LIST,
    }
    ALL_KEYS = set(EXPECTED_TYPES.keys())

    def __init__(self, check_path: str, idx: int, config: dict[any, any]):
        self.check_path = check_path
        self.idx = idx

        self._validate(config)

        self.name = config[self.NAME]
        self.task = config[self.TASK]
        self.outputs = config[self.OUTPUTS]
        self.params = config.get(self.PARAMS, {})
        self.dependencies = config.get(self.DEPENDENCIES, [])

    def _validate(self, config: dict) -> None:
        config_keys = set(config.keys())

        missing_required_keys = self.REQUIRED_KEYS.difference(config_keys)
        if missing_required_keys:
            raise PipelineDefinitionError(
                f"check: {self.check_path} pipeline entry at index: {self.idx} missing required keys: {missing_required_keys}")

        extra_keys = config_keys.difference(self.ALL_KEYS)
        if extra_keys:
            raise PipelineDefinitionError(
                f"check: {self.check_path} pipeline entry at index: {self.idx} contains extra keys {extra_keys}")

        for key, expected_type in self.EXPECTED_TYPES.items():
            if key not in config:
                continue
            actual_type = Type.of_val(config[key])
            if expected_type != actual_type:
                raise PipelineDefinitionError(
                    f"check: {self.check_path}, pipeline entry: {self.idx}, key: {key}, is not the expected type: {expected_type}")

        # check params
        invalid_keys = list(filter(lambda k: Type.of_val(k) != TYPE_STR, config.get(self.PARAMS, {}).keys()))
        if invalid_keys:
            raise PipelineDefinitionError(
                f"check: {self.check_path}, param mapping keys: {invalid_keys} must be strings")

        # check deps
        for dep in config.get(self.DEPENDENCIES, []):
            self._validate_dep(dep)

    def _validate_dep(self, dep: dict[any, any]):
        if Type.of_val(dep) != TYPE_DICT:
            raise PipelineDefinitionError(
                f"check: {self.check_path}, dependencies from parent: {dep} must be a dictionary")

        for key, dep_mapping in dep.items():
            if Type.of_val(key) != TYPE_STR:
                raise PipelineDefinitionError(f"check: {self.check_path}, dependency key: {key}, must be a string")
            if Type.of_val(dep_mapping) != TYPE_DICT:
                raise PipelineDefinitionError(f"check: {self.check_path}, dependency value for: {key}, must be a dict")
            for name1, name2 in dep_mapping.items():
                if Type.of_val(name1) != TYPE_STR or Type.of_val(name2) != TYPE_STR:
                    raise PipelineDefinitionError(
                        f"check: {self.check_path}, dependency mapping for: {key}, must contain only string keys and values")


class PipelineDefinition:
    def __init__(self, check_path: str, definition: list[dict[any, any]]):
        if not Type.of_val(definition) == TYPE_LIST:
            raise PipelineDefinitionError(f"check: {check_path}, pipeline definition should be a list")
        self.entries: list[PipelineEntryDefinition] = [PipelineEntryDefinition(check_path, i, config) for i, config in
                                                       enumerate(definition)]


class FeedbackDefinition:
    SHORT_DESC = "shortDesc"
    LONG_DESC = "longDesc"
    SRC_NAUT_TOKENS = "srcNautTokens"
    SRC_NAUT_SENTENCES = "srcNautSentences"
    SRC_NAUT_TOKENS_ON_SELECT = "srcNautTokensOnSelect"
    DST_TEXT = "dstText"
    TYPE = "type"
    CATEGORY = "category"
    REQUIRED_KEYS = {TYPE, CATEGORY}
    EXPECTED_TYPES = {
        SHORT_DESC: TYPE_STR,
        LONG_DESC: TYPE_STR,
        SRC_NAUT_TOKENS: TYPE_STR,
        SRC_NAUT_SENTENCES: TYPE_STR,
        SRC_NAUT_TOKENS_ON_SELECT: TYPE_STR,
        DST_TEXT: TYPE_STR,
        TYPE: TYPE_STR,
        CATEGORY: TYPE_STR,
    }
    ALL_KEYS = set(EXPECTED_TYPES.keys())

    def __init__(self, check_id: str, config: dict[any, any]):
        self.check_id = check_id
        self._validate(config)

        self.feedback_type = config.get(self.TYPE)
        self.feedback_category = config.get(self.CATEGORY)
        self.short_desc_template = config.get(self.SHORT_DESC)
        self.long_desc_template = config.get(self.LONG_DESC)

        # We currently assume that there is only one variable in "srcNautTokens" or "srcNautSentences"
        # Otherwise, we'll need to check if their types are the same. It also introduces
        # extra complexity since we have to concatenate each arrays of all srcNautToken variables
        # But which array goes first when we concatenate them together?
        # I guess one assumption we can make is to concat all the lists in the same order as they appear in the yaml
        self.src_naut_tokens_var_name = config.get(self.SRC_NAUT_TOKENS)
        self.dst_text_var_name = config.get(self.DST_TEXT)
        self.src_naut_sentences_var_name = config.get(self.SRC_NAUT_SENTENCES)
        assert only_one(self.src_naut_tokens_var_name, self.src_naut_sentences_var_name), \
            f"feedback for {check_id} can only contain one of {self.SRC_NAUT_TOKENS} or {self.SRC_NAUT_SENTENCES}"
        self.src_naut_tokens_on_select_var_name = config.get(self.SRC_NAUT_TOKENS_ON_SELECT)

    def _validate(self, config: dict[any, any]) -> None:
        config_keys = set(config.keys())

        missing_required_keys = self.REQUIRED_KEYS.difference(config_keys)
        if missing_required_keys:
            raise FeedbackDefinitionError(
                f"check: {self.check_id}, is missing required keys {missing_required_keys} in its Feedback definition")
        extra_keys = config_keys.difference(self.ALL_KEYS)
        if extra_keys:
            raise FeedbackDefinitionError(f"{self.check_id} contains extra keys {extra_keys} in its Feedback definition")
        for key, expected_type in self.EXPECTED_TYPES.items():
            if key not in config:
                continue
            actual_type = Type.of_val(config[key])
            if actual_type != expected_type:
                raise FeedbackDefinitionError(
                    f"check: {self.check_id}, Feedback parameter {key}, expected type: {expected_type}, actual type: {actual_type}")


class CheckDef:
    PIPELINE = "Pipeline"
    FEEDBACK = "Feedback"
    REQUIRED_KEYS = {PIPELINE, FEEDBACK}

    def __init__(self, check_path: str):
        self.check_path = check_path
        with open(check_path, 'r') as stream:
            config_yaml = yaml.safe_load(stream)
        if not set(config_yaml.keys()).issuperset(self.REQUIRED_KEYS):
            raise PipelineDefinitionError(f"{check_path} check missing required keys")
        self.pipeline_def = PipelineDefinition(check_path, config_yaml[self.PIPELINE])
        self.feedback_def = FeedbackDefinition(check_path, config_yaml[self.FEEDBACK])
