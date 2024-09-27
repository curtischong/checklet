#!/bin/bash

# the nextjs-recognized env files are .env.local and .env.production
# but we're not using that since it gets confused which env file to use when building for production

env_name=$1

# if .env.local is missing, echo and throw an error
if [ ! -f $env_name ]; then
    echo "Missing $env_name file"
    exit 1
fi

rm .env
cp $env_name .env
