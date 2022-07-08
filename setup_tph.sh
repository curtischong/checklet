#!/bin/bash


PORT=$(cat core/core/task/test/task_parsing_helper.py | grep 'SERVER_ADDRESS =' | tr -dc '0-9')
CONN_RES=$(nc -vn "" $PORT 2>&1)
if [ -z CONN_RES ]
then
    echo "task parsing helper is already running"
else
    echo "running task parsing helper"
    make serve-naut-parser &
    sleep 15
fi
