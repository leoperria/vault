#!/usr/bin/env bash

docker stop mongo_vault || true
docker rm mongo_vault || true
docker run -d --name mongo_vault -p 27027:27017 -v ~/data:/data/db mongo
