### How I deployed checklet

https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-22-04

- IMPORTANT: ensure the firewall allows ssh access: sudo ufw allow ssh

- Note: you need to run sudo ufw enable
- then I followed this to setup cloudflare with nginx
  https://www.digitalocean.com/community/tutorials/how-to-host-a-website-using-cloudflare-and-nginx-on-ubuntu-22-04#step-2-installing-the-origin-ca-certificate-in-nginx

ls -l /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/checklet /etc/nginx/sites-enabled/

- How to deploy the postgresdb:

```
docker run -d --name postgres-container -p 5432:5432 -e POSTGRES_PASSWORD=<password here> postgres
```

Then run make apply-all-migrations-prod to apply the migrations

add port 2053 to the firewall, so we can talk to the socket server
sudo ufw allow 2053/tcp
