#!/bin/bash

# virtual env
if [ -d "./env" ]
then
    echo "virtual env exists"
else
    echo "Creating virtual env "
    python3 -m venv env
fi

# get dependencies
source env/bin/activate
pip3 install --upgrade pip
pip3 install -e ./core

DATASETS_PATH="core/core/datasets"
if [[ ! -d $DATASETS_PATH ]]
then
    echo "please download the datasets.zip file"
    exit 1
fi

PORT=$(cat core/core/task/test/task_parsing_helper.py | grep 'SERVER_ADDRESS =' | tr -dc '0-9')
CONN_RES=$(lsof -i:$PORT)
if [[ -z $CONN_RES ]]
then
    echo "serving task parsing helper"
    make serve-naut-parser
else
    echo "task parsing helper is already running"
fi
