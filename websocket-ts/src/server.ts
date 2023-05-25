import WebSocket from "ws";

const port = parseInt(process.env.PORT || '8000');

const server = new WebSocket.Server({ port: port });
const clients = new Set<WebSocket>();

console.log("Server is running on port 8000");

server.on("connection", (socket: WebSocket) => {
    console.log("WebSocket connected");
    clients.add(socket);

    socket.on('message', function message(data: Buffer) {
        clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {

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
