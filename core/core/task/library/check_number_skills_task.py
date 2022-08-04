from core.converters.input.naut_parser import NautDoc, NautSent

MAX_NUM_SKILLS = 7

# filters sentences by the starting word
def check_number_skills_task(skill_sents: list[NautSent]) -> list[NautSent]:
    flagged_sents = []

    for sentence in skill_sents:
        num_skills = len(sentence.text.split(","))
        if num_skills > MAX_NUM_SKILLS:
            flagged_sents.append(sentence)

    return flagged_sents
