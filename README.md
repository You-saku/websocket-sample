# websocket-sample

## Structure
```
websocket-sample
├── README.md
├── websocket-react (client)
└── websocket-ts (server)
```

## Requirements
```
node --version v20.2.0
npm --version 9.6.6
npx --version 9.6.6
aws --version 2.7.7
docker-compose --version 1.29.1
```

## Setup
```
$ git clone git@github.com:You-saku/websocket-sample.git
$ cd websocket-sample
--- setup websocket server --- 
$ cd websocket-ts
$ cp .env.example .env
$ npm install
$ docker-compose up -d --build
$ aws dynamodb create-table --cli-input-json file://dynamodb/schema.json --endpoint-url=http://0.0.0.0:8000
$ node lib/server.js
--- setup client ---
$ cd websocket-react
$ cp .env.example .env.local
$ npm install
$ npm run start
```
