import WebSocket from "ws";
import * as dotenv from "dotenv";
import { ddb } from "./aws/dynamodb";
import { ReceivedMessage } from "./types/ReceivedMessage";
dotenv.config(); // read .env file

const port = parseInt(process.env.PORT || '0000');
const server = new WebSocket.Server({ port: port });
const clients = new Set<WebSocket>();
const tableName = 'chat_histories';

console.log("Server is running on port 9000");

server.on("connection", (socket: WebSocket) => {
    console.log("WebSocket connected");
    clients.add(socket);

    socket.on('message', function message(message: Buffer) {
        clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
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

function decodeBufferToJson(data: Buffer) {
    const str = data.toString('utf8');
    return JSON.parse(str);
}

function putMessage(object: ReceivedMessage) {
    const createdAt: number = Date.now();

    // put DynamoDB
    // TODO rewrite to AWS SDK v3
    ddb.putItem({
        TableName: tableName,
        Item: {
            'id': { S: '1' },
            'username' : { S : `${object.username}` },
            'message': { S: `${object.message}` },
            'created_at' : { N : `${createdAt}` },
        }
    }, function(err: any) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success");
        }
    });
}
