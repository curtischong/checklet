#!/bin/bash

# Check if a variable name was passed as an argument
if [ -z "$1" ]; then
  echo "Please provide a variable name."
  exit 1
fi

VAR_NAME=$1

# Load only the specified variable from .env-prod
if [ -f .env-prod ]; then
  export $(grep "^${VAR_NAME}=" .env-prod | xargs)
  
  # Check if the variable was found and exported
  if [ -z "${!VAR_NAME}" ]; then
    echo "Variable '${VAR_NAME}' not found in .env-prod."
  else
    echo "Exported ${VAR_NAME}."
  fi
else
  echo ".env-prod file not found."
  exit 1
fi
