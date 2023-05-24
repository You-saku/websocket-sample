"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const dotenv = __importStar(require("dotenv"));
const dynamodb_1 = require("./aws/dynamodb");
dotenv.config(); // read .env file
const port = parseInt(process.env.PORT || '0000');
const server = new ws_1.default.Server({ port: port });
const clients = new Set();
const tableName = 'chat_histories';
console.log("Server is running on port 9000");
server.on("connection", (socket) => {
    console.log("WebSocket connected");
    clients.add(socket);
    socket.on('message', function message(message) {
        clients.forEach(function each(client) {
            if (client.readyState === ws_1.default.OPEN) {
                // decode Buffer to JSON
                const receivedData = decodeBufferToJson(message);
                // put DynamoDB
                putMessage(receivedData);
                // send message to all clients
                client.send(`${receivedData.message}`);
            }
        });
    });
    socket.on("close", () => {
        clients.delete(socket);
        console.log("WebSocket closed");
    });
});
function decodeBufferToJson(data) {
    const str = data.toString('utf8');
    return JSON.parse(str);
}
function putMessage(object) {
    const createdAt = Date.now();
    // put DynamoDB
    // TODO rewrite to AWS SDK v3
    dynamodb_1.ddb.putItem({
        TableName: tableName,
        Item: {
            'id': { S: '1' },
            'username': { S: `${object.username}` },
            'message': { S: `${object.message}` },
            'created_at': { N: `${createdAt}` },
        }
    }, function (err) {
        if (err) {
            console.log("Error", err);
        }
        else {
            console.log("Success");
        }
    });
}
