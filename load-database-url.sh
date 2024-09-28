#!/bin/bash

# Load only the DATABASE_URL variable from .env-prod
if [ -f .env-prod ]; then
  export $(grep '^DATABASE_URL=' .env-prod | xargs)
else
  echo ".env-prod file not found"
fi