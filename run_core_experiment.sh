#!/bin/bash

source env/bin/activate
python3 core_experiment.py

if [[ $? -ne 0 ]]; then
    echo ""
    echo "🤔 have you run ./setup_core_experiment.sh?"
fi
