"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const server = new ws_1.default.Server({ port: 8000 });
const clients = new Set();
console.log("Server is running on port 8000");
server.on("connection", (socket) => {
    console.log("WebSocket connected");
    clients.add(socket);
    socket.on('message', function message(data) {
        const name = getRandomName(getRandomInt(0, 5));
        clients.forEach(function each(client) {
            if (client.readyState === ws_1.default.OPEN) {
                console.log(`${name} : ${data.toString('utf8')}`);
                client.send(`${name} : ${data.toString('utf8')}`);
            }
        });
    });
    socket.on("close", () => {
        clients.delete(socket);
        console.log("WebSocket closed");
    });
});
function getRandomName(index) {
    const names = ["John", "Jane", "Joe", "Jill", "Jack", "Jim"];
    return names[index];
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
