# make sure you set the security rules on aws to allow https and http! (http for testing)

# on server install docker:

1. https://docs.docker.com/engine/install/ubuntu/
2. sudo systemctl start docker

sudo docker pull redis/redis-stack:latest
sudo docker pull splacorn/checklet-nginx:latest
sudo docker pull splacorn/checklet:latest
sudo docker compose up (NOT docker-compose!)

# now get the ssl cert

https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal
following: https://stackoverflow.com/questions/74185594/how-to-deploy-a-next-js-app-on-https-ssl-connection-with-docker

sudo apt install nginx
sudo certbot certonly --nginx

on server:

sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
export OPENAI_API_KEY=<apikey> && sudo docker-compose up
