#!/bin/bash
export no_proxy="localhost,127.0.0.1,.homedepot.com"

cd RepairDepot-UI
./scripts/setup.sh && npm run e2e
if [ $? -eq 0 ]
then
  echo "SUCCESS: E2E TEST COVERAGE"
  exit 0
else
  echo "FAILED: E2E TEST COVERAGE"
  exit 1
fi

cd ..
