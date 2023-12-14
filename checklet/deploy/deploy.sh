docker build --platform linux/amd64 -t yourwriterfriend . 
docker tag yourwriterfriend splacorn/yourwriterfriend
docker push splacorn/yourwriterfriend


# on server
# sudo systemctl start docker
# sudo docker pull redis/redis-stack:latest
# sudo docker pull splacorn/yourwriterfriend
# sudo docker run -p 80:3000 redis/redis-stack:latest
# sudo docker ps (to get the container id to put into the next command)
# sudo docker run --env OPENAI_API_KEY=<apikey> --net=container:77d9570d6e26 splacorn/yourwriterfriend:latest
	

# deploy via docker compose:
# yarn send-docker-compose
#
# on server:
#
# sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
# sudo chmod +x /usr/local/bin/docker-compose
# export OPENAI_API_KEY=<apikey> && sudo docker-compose up