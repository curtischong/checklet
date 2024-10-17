#!/bin/bash

rm -rf .next

npm run build && cd sockets && npm run build && cd ../ || { echo "npm run build failed"; exit 1; }

 # https://github.com/vercel/next.js/issues/49283
 # the static files are NOT copied to the .next directory under standalone because
 # nextjs thinks they should be served from a CDN instead. but we don't have one!
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
cp node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node .next/standalone/.next/server

cp sockets/dist/bundle.js .next/standalone/websocket_server.cjs

rm standalone.zip
cd .next
zip -r ../standalone.zip standalone
cd ..

scp standalone.zip "checkletv2:/home/ubuntu/standalone.zip"

source load-prod-var.sh 'OPENAI_KEY'
OPENAI_KEY=$OPENAI_KEY

session_name="checkletapp"
ssh checkletv2 << EOF

# Commands to run on the remote server
cd /home/ubuntu/

rm -rf standalone
unzip standalone.zip

# Define the session name
session_name=webapp-session

# leave the current tmux session (if we don't we may crash and the script may not deploy)
tmux send-keys -t $session_name C-b d

# Kill the existing session if it exists
tmux kill-session -t $session_name

# Create a new session
tmux new-session -d -s $session_name -n server

# Run the server in the first window
# export next sharp path to fix error: https://nextjs.org/docs/messages/sharp-missing-in-production
tmux send-keys -t $session_name 'export OPENAI_API_KEY=${OPENAI_KEY} && export NEXT_SHARP_PATH=/tmp/node_modules/sharp && node /home/ubuntu/standalone/server.js' C-m

# Create a new window for the socket server
tmux new-window -t $session_name -n socket-server

# Run the server in the first window
# cd to standalone so it can see the .env file
tmux send-keys -t $session_name:socket-server 'cd /home/ubuntu/standalone && export OPENAI_API_KEY=${OPENAI_KEY} && node websocket_server.cjs' C-m
EOF
