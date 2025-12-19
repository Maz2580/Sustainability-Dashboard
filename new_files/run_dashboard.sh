#!/bin/bash
echo "Starting Flight Emissions Dashboard..."
if [ $# -eq 0 ]; then
    python3 server.py
else
    python3 server.py --port $1
fi 