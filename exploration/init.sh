#!/bin/sh

# create the virtual env
python3 -m venv env

# enter the venv
source env/bin/activate

pip install -r requirements.txt
# Add the virtual env to your ipython kernel:
python -m ipykernel install --name=venv --user

spacy download en_core_web_sm
