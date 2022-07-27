import os
import pathlib

# these verbs are from https://www.themuse.com/advice/185-powerful-verbs-that-will-make-your-resume-awesome
# I blacklisted these verbs since they aren't very strong action verbs
blacklist_verbs = {"built", "created"}
tech_verbs = ["automated"]  # TODO: replace this with a dataset


class ActionVerbs:
    embedding_len = 300

    def __init__(self):
        path = pathlib.Path(__file__).parent.joinpath("../../datasets/corpus")
        file_path = os.path.join(path, 'action_verbs.txt')
        with open(file_path, 'r') as action_verb_file:
            processed_verbs = []
            known_verbs = action_verb_file.read().splitlines() + tech_verbs
            for verb in known_verbs:
                verb = verb.lower()
                if verb not in blacklist_verbs:
                    processed_verbs.append(verb)
            self.action_verbs = set(processed_verbs)

    def in_action_verbs(self, verb) -> bool:
        return verb.lower() in self.action_verbs
