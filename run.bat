@echo off
cd server
start cmd /k "yarn start"

cd ../linkpix
yarn start
