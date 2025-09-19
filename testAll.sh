#!/bin/sh 
# find ./dist/ -type f -name "*test.js" -exec k6 run --out=cloud --vus 10 --duration 10s "{}" \;

find ./dist/ -type f -name "*test.js" -exec k6 run --out=cloud "{}" \;