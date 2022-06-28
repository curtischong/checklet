start-stanford:
	cd exploration/stanford-corenlp-4.4.0 && java -mx4g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer -port 9000 -timeout 15000

serve-naut-parser:
	python core/core/task/test/task_parsing_helper.py
