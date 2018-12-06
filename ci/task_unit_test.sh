#!/bin/bash

cd RepairDepot-UI
./scripts/setup.sh && cd ./client/ && npm run test
if [ $? -eq 0 ]
then
  echo "SUCCESS: UNIT TEST COVERAGE"
else
  echo "FAILED: UNIT TEST COVERAGE"
  exit 1
fi
cd ..
