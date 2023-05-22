import WebSocket from "ws";

const server = new WebSocket.Server({ port: 8000 });
const clients = new Set<WebSocket>();

console.log("Server is running on port 8000");

server.on("connection", (socket: WebSocket) => {
    console.log("WebSocket connected");
    clients.add(socket);

    socket.on('message', function message(data: Buffer) {
        const name = getRandomName(getRandomInt(0,5));
        clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {

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

function getRandomName(index: number): string {
    const names = ["John", "Jane", "Joe", "Jill", "Jack", "Jim"];
    return names[index];
}

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
