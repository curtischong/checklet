FROM redis/redis-stack:latest 

COPY redis-stack.conf /etc/redis-stack.conf
COPY redis-stack.conf /redis-stack.conf

# ENV PORT=6379
EXPOSE 6379
EXPOSE 8001

CMD [ "redis-stack-server", "/etc/redis-stack.conf" ]