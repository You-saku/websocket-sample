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
```

## Setup
```
$ git clone git@github.com:You-saku/websocket-sample.git
$ cd websocket-sample
--- setup websocket server --- 
$ cd websocket-ts
$ cp .env.example .env
$ npm install
$ node lib/server.js
--- setup client ---
$ cd websocket-react
$ cp .env.example .env
$ npm install
$ npm run start
```
