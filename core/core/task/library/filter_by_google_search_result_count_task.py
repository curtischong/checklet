import re

from bs4 import BeautifulSoup
from requests import get

from core.converters.input.naut_parser import NautToken

usr_agent = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'}


# TODO: consider adding retrying
def search(query):
    lang = "en"
    resp = get(
        url="https://www.google.com/search",
        headers=usr_agent,
        params=dict(
            q=query,
            hl=lang,
            start=0,
            num=1,  # so we only get 1 result and we don't DDOS google
        ),
    )
    return resp


num_results_regex = re.compile('(\S+) results')


# TODO: when dag v3 gives us parameterized inputs, we should have this task take in:
#  - the comparison sign (<, >, <=, >=, ==)
#  - the number of results to compare to: n

# TODO: consider breaking this up into 2 tasks:
#  - 1 for doing the google search
#  - 1 for filtering by the number of results
def filter_by_google_search_result_count_task(phrases: list[list[NautToken]]) -> list[list[list[NautToken]]]:
    queries = []
    for phrase in phrases:
        phrase_text = " ".join([str(token) for token in phrase])
        queries.append(f"\"{phrase_text}\"")

    obscure_phrases = []
    for i in range(len(queries)):
        query = queries[i]
        resp = search(query)
        if resp.status_code != 200:
            print(
                f"WARNING: google_search_yields_geq_n_results_task had status code={res.status_code} for url={res.url}")
        else:
            soup = BeautifulSoup(resp.text, 'html.parser')
            stats = soup.find("div", {"id": "result-stats"}).get_text()
            num_results_str = num_results_regex.search(stats).group(1)
            num_results = ''.join(filter(str.isdigit, num_results_str))
            try:
                num_results = int(num_results)
                if num_results <= 500:
                    obscure_phrases.append([phrases[i]])  # wrap in a list so the tokens are considered as a clause
            except:
                print("Could not convert Google search results number to integer")
                pass
    return obscure_phrases
