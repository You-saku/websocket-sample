import {Message } from "./types/Message";
import WebSocket from "ws";

const port = parseInt(process.env.PORT || '8000');

const server = new WebSocket.Server({ port: port });
const clients = new Set<WebSocket>();
const streamers = new Set<WebSocket>();

console.log("Server is running on port 8000");

server.on("connection", (socket: WebSocket) => {
    console.log("WebSocket connected");

    socket.on('message', function message(data: Buffer) {
        const message: Message = stringToJson(data.toString());
        console.log(message); // for debug

        // first connection
        if ( message.username === undefined ) {
            console.log("Connection");
            if (message.client) {
                clients.add(socket);
                console.log("Client");
            } else {
                streamers.add(socket);
                console.log("Streamer");
            }

            return;
        }

        // receive message
        if (message.client) {
            streamers.forEach(function each(streamer) {
                if (streamer.readyState === WebSocket.OPEN) {
                    console.log(`${data}`); // for debug
                    streamer.send(`${data}`); // send Object to all client
                }
            });
        }

        return;
    });

    socket.on("close", () => {
        clients.delete(socket);
        console.log("WebSocket closed");
    });
});

function stringToJson(word: string) {
    return JSON.parse(word);
}
