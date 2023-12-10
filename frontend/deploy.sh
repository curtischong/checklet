docker build --platform linux/amd64 -t yourwriterfriend . 
docker tag yourwriterfriend splacorn/yourwriterfriend
docker push splacorn/yourwriterfriend


# on server
# sudo systemctl start docker
# sudo docker pull redis/redis-stack:latest
# sudo docker run -d -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
# sudo docker pull splacorn/yourwriterfriend
# sudo docker start splacorn/yourwriterfriend
# sudo docker run -p 80:3000 splacorn/yourwriterfriend