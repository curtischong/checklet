import openai
import diskcache
import hashlib
import json
import os
from typing import Any
from openai.types.chat import ChatCompletionMessageParam

logs_dir = os.path.join(os.getcwd(), '.chatgpt_history/logs')
cache_dir = os.path.join(os.getcwd(), '.chatgpt_history/cache')
os.makedirs(logs_dir, exist_ok=True)
os.makedirs(cache_dir, exist_ok=True)

cache = diskcache.Cache(cache_dir)
def get_key(messages):
    return hashlib.sha256(json.dumps(messages, sort_keys=True).encode()).hexdigest()

class Llm:
    def __init__(self, system_prompt:str, use_cache=False) -> None:
        self.use_cache = use_cache

        self.client = openai.OpenAI()
        self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages = [{'role': 'system', 'content': system_prompt}]
        )
    
    def prompt(self, prompt:ChatCompletionMessageParam) -> Any:
        if self.use_cache:
            key = get_key(prompt)
            if key in cache:
                return cache.get(key)

        output = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages = [prompt]
        )
        cache.set(get_key(prompt), output)