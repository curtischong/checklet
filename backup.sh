#!/bin/bash

# Set database details
DB_NAME="checklet"
DB_USER="postgres"
# BACKUP_DIR="/home/ubuntu/db_backups"
BACKUP_DIR="/Users/curtischong/Documents/dev/checklet/backups"
DB_PASSWORD=$1
TIMESTAMP=$(date +%s)

# Docker container details
DB_HOST="100.27.18.241" # Replace this with your container's IP or hostname
DB_PORT="5432" # Default PostgreSQL port

# Export password to environment variable
export PGPASSWORD=$DB_PASSWORD

# Create backup with Unix timestamp as the filename
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME > $BACKUP_DIR/db_backup_$TIMESTAMP.sql

# Optional: Remove old backups (older than 7 days in this case)
find $BACKUP_DIR/* -mtime +7 -exec rm {} \;
