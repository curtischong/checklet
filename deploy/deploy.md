# make sure you set the security rules on aws to allow https and http! (http for testing)

# If you make a client-side change, you can build and send the files to the server via:

-   yarn deploy-all
-   Then run sudo docker pull splacorn/checklet:latest and sudo docker compose up (do NOT use docker-compose)

# Next, pull the latest images on server:

1. https://docs.docker.com/engine/install/ubuntu/
2. sudo systemctl start docker

sudo docker pull splacorn/checklet-redis:latest

sudo docker pull splacorn/checklet-nginx:latest

sudo docker pull splacorn/checklet:latest

sudo docker compose up

# If you need to get ssl cert beforehand

https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal
following: https://stackoverflow.com/questions/74185594/how-to-deploy-a-next-js-app-on-https-ssl-connection-with-docker

generate it using:
sudo certbot certonly --nginx

(note: you may need to install nginx in the interim. But you can delete it afterwards since we're running nginx via docker)
sudo apt install nginx

-   do this after:
    sudo systemctl stop nginx.service
    sudo systemctl disable nginx.service

-   NOTE: we are using the nginx config in ~/ (as defined by the nginx Dockerfile - under deploy/), when you install nginx, it may create a new config file underneath /etc/nginx. we are NOT using that one

# tips

-   Before messing with ssl, or the domain, just try to visit the raw IP of the server to see if it runs
-   NOTE: We are using the redis image for production, but we are using the redis-stack image for development (so we can look into the db in the web browser to see data in the db). If you want to see the prod db, just download the .rdb backup from the server and look at it locally

# Redis backups

-   make a /redis folder with the path: /home/ubuntu/redis. This is where the backups are dumped
-   sudo chmod -R 777 /home/ubuntu/redis
-   maybe follow this group advice if you get permission issues: https://stackoverflow.com/questions/48957195/how-to-fix-docker-got-permission-denied-issue

When you restart the server, the redis docker image will automatically read the backup in that directory and load it up!

### If you want to modify the redis config, do this:

1. update the redis.conf in this repo
2. run yarn build-redis (it'll build the redis docker img and send it to the server)
3. (on the server, run:) sudo docker pull splacorn/checklet-redis:latest
4. sudo docker compose up
