#!/bin/sh
echo Downloading Typesense
mkdir typesense
wget https://dl.typesense.org/releases/0.23.1/typesense-server-0.23.1-linux-amd64.tar.gz -O typesense/typesense-0.23.1.tar.gz
cd typesense
echo Extracting
tar -xf typesense-0.23.1.tar.gz
cd ..
echo Done