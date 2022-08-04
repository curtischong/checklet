from core.task.library.check_number_skills_task import check_number_skills_task
from core.converters.input.naut_parser import NautParser

class TestNumberSkills:
    def test_too_many_skills(self):
        naut_parser = NautParser()
        doc = naut_parser.parse("Tools: Unity, Docker, Android Studio, Xcode, Visual Studio, VSCode, IntelliJ, Git, Bash, Unix, Ansible")
        res = check_number_skills_task(doc.sentences)
        assert res and len(res) == 1

    def test_enough_skills(self):
        naut_parser = NautParser()
        doc = naut_parser.parse("Tools: Unity, Docker, Android Studio, Xcode")
        res = check_number_skills_task(doc.sentences)
        assert not res