#!/bin/sh

cp -r ../core/. ./core

gcloud app deploy

rm -rf ./core
