#!/bin/bash

cd RepairDepot-UI
rm -rf node_modules dist
./scripts/setup.sh && cd client && npm run start
if [ $? -eq 0 ]
then
  
  echo "Creating tar file in the dist directory for artifactory"
  cd ..
  mkdir dist
  tar -czvf dist/build.tar.gz ./client/public ./app.js ./server/security.js ./package.json ./newrelic.js
  if [ $? -eq 0 ]
  then
    echo "SUCCESS: BUILD"
    exit 0
  else 
    echo "FAILED: BUILD"
  exit 1
  fi  
else
  echo "FAILED: BUILD"
  exit 1
fi


cd ..
