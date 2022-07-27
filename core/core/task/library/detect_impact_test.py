from core.task.library.detect_impact_task import detect_impact_task
from core.converters.input.naut_parser import NautParser

class TestMultipleNouns:
    def test_no_impact(self):
        naut_parser = NautParser()
        input = "Used MLML to speed up engine"
        doc = naut_parser.parse(input)
        res = detect_impact_task(doc)
        assert res and len(res) == 1


    def test_has_impact_percentage(self):
        naut_parser = NautParser()
        input = "Investigated bottlenecks in Dask distributed schedulers leading to a 45% speed improvement"
        doc = naut_parser.parse(input)
        res = detect_impact_task(doc)
        assert not res

    def test_has_impact_number(self):
        naut_parser = NautParser()
        input = "Refactored tests to increase throughput by 10x"
        doc = naut_parser.parse(input)
        res = detect_impact_task(doc)
        assert not res
