#!/bin/sh

echo "Deploying prod for $1"

CURR_PID=$(pgrep -f waitress)
sudo kill -9 $CURR_PID

pip install -r requirements.txt
make run-prod > prodlogs-$1 2>&1 &
