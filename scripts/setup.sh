#!/usr/bin/env bash

# filename: setup.sh

echo "[setup.sh]: Initializing setup"

echo "[setup.sh]: Purging generated files"
rm -rf \
  ./dist \
  ./test/mockData.json \
  ./client/public ./client/errorShots ./client/reports ./client/coverage

echo "[setup.sh]: Creating ./test/mockData.json"
cp ./test/mockData.json.template ./test/mockData.json

echo "[setup.sh]: Installing dependencies"

npm i

cd client
npm i 

echo "[setup.sh]: Setup complete"
