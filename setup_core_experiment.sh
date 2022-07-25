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

DATASETS_PATH="core/core/datasets"
if [[ ! -d $DATASETS_PATH ]]
then
    echo "please download the datasets.zip file"
    exit 1
fi

run_serve_naut_parser() {
    PORT=$(cat core/core/task/test/task_parsing_helper.py | grep 'SERVER_ADDRESS =' | tr -dc '0-9')
    CONN_RES=$(lsof -i:$PORT)
    if [[ -z $CONN_RES ]]
    then
        echo "serving task parsing helper"
        make serve-naut-parser
    else
        echo "task parsing helper is already running"
    fi
}

# try to run server without installing deps
run_serve_naut_parser


# This is a very quick hacky workaround - at the request of 10'xer Curtis Chong
pip3 install --upgrade pip
pip3 install -e ./core

# okay, we installed dependencies, try running now
run_serve_naut_parser
