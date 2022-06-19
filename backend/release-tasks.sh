#!/bin/sh

python src/manage.py migrate
spacy download en_core_web_sm
