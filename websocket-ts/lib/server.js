"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const port = parseInt(process.env.PORT || '8000');
const server = new ws_1.default.Server({ port: port });
const clients = new Set();
const streamers = new Set();
console.log("Server is running on port 8000");
server.on("connection", (socket) => {
    console.log("WebSocket connected");
    socket.on('message', function message(data) {
        const message = stringToJson(data.toString());
        // first connection
        if (message.username === undefined) {
            console.log("Connection");
            if (message.client) {
                clients.add(socket);
            }
            else {
                streamers.add(socket);
            }
            console.log(`Client : ${clients.size}, Streamer : ${streamers.size}`);
            return;
        }
        // receive message
        if (message.client) {
            streamers.forEach(function each(streamer) {
                if (streamer.readyState === ws_1.default.OPEN) {
                    console.log(`${data}`); // for debug
                    streamer.send(`${data}`); // send Object to all client
                }
            });
        }
        return;
    });
    socket.on("close", () => {
        clients.delete(socket);
        streamers.delete(socket);
        console.log("WebSocket closed");
        console.log(`Client : ${clients.size}, Streamer : ${streamers.size}`);
    });
});
function stringToJson(word) {
    return JSON.parse(word);
}
