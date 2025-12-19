@echo off
echo Starting Flight Emissions Dashboard...
if "%1"=="" (
    python server.py
) else (
    python server.py --port %1
)
pause 