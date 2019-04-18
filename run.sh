#!/bin/bash

echo "Starting mongo"
docker-compose up -d

echo "Starting backend"
cd backend
npm install 
npm run jest
npm run ts-node & 

echo "Starting frontend"
cd ../frontend
npm install
npm start &

function cleanup {
    echo "Stoping mongo"
    docker-compose down
}

