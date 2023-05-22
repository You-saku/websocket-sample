import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8000');

ws.on('error', console.error);

ws.on('open', function open() {
    const array = new Float32Array(5);

    for (var i = 0; i < array.length; ++i) {
        var num: number = i / 2;
        ws.send(array[i]);
        array[i] = num;
    }

    ws.send(array);
});