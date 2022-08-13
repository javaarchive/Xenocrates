#!/bin/sh
TYPESENSE_API_KEY=myepicfoobar2000
source .env
echo Ignore above error if you have no .env
cd typesense
echo Starting Typesense
mkdir -p data
./typesense-server --data-dir=data --api-key=$TYPESENSE_API_KEY --enable-cors
cd ..