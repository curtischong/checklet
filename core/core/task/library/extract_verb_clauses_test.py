from core.task.library.extract_verb_clauses import extract_verb_clauses_task
from core.task.test.task_parsing_helper import TaskParsingHelper

# sent = "he plays cricket but does not play hockey."
sent = "Automated inserting and categorizing 20k+ emails from over 200 clients in a CRM by creating an email monitoring REST API using Express, and deployed the service on Azure Cloud with Docker"


# sent = "Developed a CI/CD system with Jenkins to automatically test, build, and publish a Scikit-Learn based ML service, reducing test failures by 80% and decreasing deployment time by 50%"
# sent = "Implemented a host-device communications system in Rust and Node.js to increase data transfer speed by 7x compared to previous methods, enabling the addition of new types of sensors"

# sent = "Selected a storage engine by creating a benchmark testing suite tracking latency and memory per operation, as well as total disk usage for various key value stores."
# sent = "Built a Go service and client CLI to export build and deployment metrics from all 600+ company CI/CD pipelines to Prometheus and created Grafana dashboards for data visualization"
# sent = "Established a cron testing service in Spring Boot with integrations to databases and multiple platform services to support overall system validation scenarios"
# sent = "Designed and built a new React web application to amalgamate three core client workflows into one tool, with emphasis on ease of use, and improved functionality"

def run_test():
    tph = TaskParsingHelper()
    doc = tph.parse_document(sent)
    clauses = extract_verb_clauses_task(doc)
    for clause in clauses:
        print(clause)


if __name__ == "__main__":
    run_test()
