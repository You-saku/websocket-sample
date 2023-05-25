"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const port = parseInt(process.env.PORT || '8000');
const server = new ws_1.default.Server({ port: port });
const clients = new Set();
console.log("Server is running on port 8000");
server.on("connection", (socket) => {
    console.log("WebSocket connected");
    clients.add(socket);
    socket.on('message', function message(data) {
        clients.forEach(function each(client) {
            if (client.readyState === ws_1.default.OPEN) {
                console.log(`${data}`);
                client.send(`${data}`); // send Object to all client
            }
        });
    });
    socket.on("close", () => {
        clients.delete(socket);
        console.log("WebSocket closed");
    });
});
