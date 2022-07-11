#!/bin/sh

echo "Running deployment for $1"
gcloud compute scp --recurse ../backend instance-1:~/ --recurse --zone "northamerica-northeast2-a" --project "backend-nautilus"
# gcloud compute scp --recurse ../core instance-1:~/ --recurse --zone "northamerica-northeast2-a" --project "backend-nautilus"
gcloud compute ssh --zone "northamerica-northeast2-a" "instance-1"  --project "backend-nautilus" --command "cd backend/ && ./prod_run.sh $1"