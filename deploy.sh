#!/bin/bash

rm -rf .next

npm run build

 # https://github.com/vercel/next.js/issues/49283
 # the static files are NOT copied to the .next directory under standalone because
 # nextjs thinks they should be served from a CDN instead. but we don't have one!
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
cp node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node .next/standalone/.next/server

rm standalone.zip
cd .next
zip -r ../standalone.zip standalone
cd ..

scp standalone.zip "checkletv2:/home/ubuntu/standalone.zip"

ssh checkletv2 << 'EOF'

# Commands to run on the remote server
cd /home/ubuntu/

rm -rf standalone
unzip standalone.zip

# Define the session name
session_name=webapp-session

# Kill the existing session if it exists
tmux kill-session -t $session_name

# Create a new session
tmux new-session -d -s $session_name -n server

# Run the server in the first window
tmux send-keys -t $session_name 'node /home/ubuntu/standalone/server.js' C-m
EOF
