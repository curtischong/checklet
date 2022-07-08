#!/bin/bash

if [ -d "./env" ]
then
    echo "virtual env exists"
else
    echo "Creating virtual env "
    python3 -m venv env
    source env/bin/activate
    pip3 install --upgrade pip
    pip3 install -e ./core
fi
