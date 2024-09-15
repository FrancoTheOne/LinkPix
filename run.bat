@echo off
cd server
start cmd /k "yarn start"

cd ../linkpix
start cmd /k "yarn start"

start chrome --incognito "http://localhost:3000"