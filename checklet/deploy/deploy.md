# on server install docker:

1. https://docs.docker.com/engine/install/ubuntu/
2. sudo systemctl start docker

    sudo docker pull redis/redis-stack:latest
    sudo docker pull splacorn/checklet
    sudo docker pull splacorn/checklet
    sudo docker run -p 80:3000 redis/redis-stack:latest
    sudo docker ps (to get the container id to put into the next command)
    sudo docker run --env OPENAI_API_KEY=<apikey> --net=container:77d9570d6e26 splacorn/yourwriterfriend:latest

https://certbot.eff.org/instructions?ws=nginx&os=centosrhel8
following: https://stackoverflow.com/questions/74185594/how-to-deploy-a-next-js-app-on-https-ssl-connection-with-docker
deploy via docker compose:
yarn send-docker-compose

on server:

sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
export OPENAI_API_KEY=<apikey> && sudo docker-compose up
