#!/bin/sh

# create the virtual env
python3 -m venv env

# enter the venv
source env/bin/activate

pip install -r requirements.txt
spacy download en_core_web_sm