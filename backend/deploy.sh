#!/bin/sh

gcloud compute scp --recurse ../backend instance-1:~/ --recurse --zone "northamerica-northeast2-a" --project "backend-nautilus"
gcloud compute scp --recurse ../core instance-1:~/ --recurse --zone "northamerica-northeast2-a" --project "backend-nautilus"

