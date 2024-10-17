#!/bin/bash

export DATABASE_URL=$(jq -r '.postgres | "postgresql://\(.user):\(.password)@\(.host):\(.port)/\(.db_name)?sslmode=\(.sslmode)"' "$JSON_FILE")