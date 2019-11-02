#!/usr/bin/env bash

## Example of building and running the production docker container

docker stop mongo_vault || true
docker rm mongo_vault || true
docker run -d --name mongo_vault -p 27027:27017 -v ~/data:/data/db mongo

docker stop vault-api || true
docker rm vault-api || true
docker build -t leoperria/vault-api .
docker run \
       -d \
       --restart always \
       --name vault-api \
       -e PORT=3010 \
       -e MONGO_URI=mongodb://localhost:27027/vault \
       -e MONGO_URI_TESTS=mongodb://localhost:27027/vault_test \
       --network="host" \
       leoperria/vault-api:latest

