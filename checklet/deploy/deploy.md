# make sure you set the security rules on aws to allow https and http! (http for testing)

# build and send the files to the server

yarn send-env

# on server install docker:

1. https://docs.docker.com/engine/install/ubuntu/
2. sudo systemctl start docker

sudo docker pull redis/redis-stack:latest
sudo docker pull splacorn/checklet-nginx:latest
sudo docker pull splacorn/checklet:latest
sudo docker compose up (do NOT use docker-compose)

# If you need to get ssl cert beforehand

https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal
following: https://stackoverflow.com/questions/74185594/how-to-deploy-a-next-js-app-on-https-ssl-connection-with-docker

generate it using:
sudo certbot certonly --nginx

(note: you may need to install nginx in the interim. But you can delete it afterwards since we're running nginx via docker)
sudo apt install nginx

-   NOTE: we are using the nginx config in ~/ (as defined by the nginx Dockerfile - under deploy/), when you install nginx, it may create a new config file underneath /etc/nginx. we are NOT using that one

# tips

Before messing with ssl, or the domain, just try to visit the raw IP of the server to see if it runs
