#!/bin/sh

spacy download en_core_web_sm
python src/manage.py migrate
