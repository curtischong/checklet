import yaml

from core.lib.utils.optional import only_one
from core.type.Type import Type, TYPE_STR, TYPE_DICT, TYPE_LIST


class PipelineDefinitionError(Exception):
    pass


class FeedbackDefinitionError(Exception):
    pass


class PipelineEntryDefinition:
    def __init__(self, check_path: str, name: str, task: str, dependencies: list[dict[str, any]],
                 params: dict[str, any],
                 outputs: list[str]):
        self.check_path = check_path
        self.name = name
        self.task = task
        self.dependencies = dependencies
        self.params = params
        self.outputs = outputs
        self._validate()

    def _validate(self) -> None:
        if Type.of_val(self.name) != TYPE_STR:
            raise PipelineDefinitionError(f"{self.check_path} {self.name} pipeline entry name must be a string")
        if Type.of_val(self.outputs) != TYPE_LIST:
            raise PipelineDefinitionError(f"{self.check_path} {self.name} output type must be a list")

        def validate_str_dict(check_path: str, entry_name: str, d: dict[any, any]) -> None:
            if d and Type.of_val(d) != TYPE_DICT:
                raise PipelineDefinitionError(f"{check_path}, {entry_name} must be a dictionary")
            invalid_keys = list(filter(lambda dk: Type.of_val(dk) != TYPE_STR, d.keys()))
            if invalid_keys:
                raise PipelineDefinitionError(f"{check_path}, {entry_name}, keys: {invalid_keys} must be strings")

        if Type.of_val(self.dependencies) != TYPE_LIST:
            raise PipelineDefinitionError(f"{self.check_path} deps is not a list")
        for dep in self.dependencies:
            validate_str_dict(self.check_path, "dep", dep)
        validate_str_dict(self.check_path, "params", self.params)


class PipelineDefinition:
    NAME = "name"
    TASK = "task"
    DEPENDENCIES = "dependencies"
    PARAMS = "params"
    OUTPUTS = "outputs"
    REQUIRED_KEYS = {NAME, TASK, OUTPUTS}
    ALL_KEYS = {NAME, TASK, DEPENDENCIES, PARAMS, OUTPUTS}

    def __init__(self, check_path: str, definition: list[dict[any, any]]):
        if not Type.of_val(definition) == TYPE_LIST:
            raise PipelineDefinitionError(f"{check_path} pipeline definition should be a list")

        self.entries: list[PipelineEntryDefinition] = []
        for config in definition:
            if not set(config.keys()).issuperset(self.REQUIRED_KEYS):
                raise PipelineDefinitionError(f"check {check_path} pipeline missing required keys")

            name = config[self.NAME]
            task = config[self.TASK]
            outputs = config[self.OUTPUTS]
            dependencies = config.get(self.DEPENDENCIES, [])
            params = config.get(self.PARAMS, {})
            self.entries.append(
                PipelineEntryDefinition(check_path=check_path, name=name, task=task, dependencies=dependencies,
                                        params=params, outputs=outputs))


class FeedbackDefinition:
    SHORT_DESC = "shortDesc"
    LONG_DESC = "longDesc"
    SRC_NAUT_TOKENS = "srcNautTokens"
    SRC_NAUT_SENTENCES = "srcNautSentences"
    SRC_NAUT_TOKENS_ON_SELECT = "srcNautTokenDsOnSelect"
    DST_TEXT = "dstText"
    TYPE = "type"
    CATEGORY = "category"
    REQUIRED_KEYS = {TYPE, CATEGORY}

    def __init__(self, check_id: str, config: dict[any, any]):
        self.check_id = check_id
        if not set(config.keys()).issuperset(self.REQUIRED_KEYS):
            raise FeedbackDefinitionError(f"{check_id} is missing required keys in its Feedback definition")

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
            f"The Feedback for {check_id} can only contain one of srcNautTokens or srcNautSentences in the .yaml"
        self.src_naut_tokens_on_select_var_name = config.get("srcNautTokensOnSelect")


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
