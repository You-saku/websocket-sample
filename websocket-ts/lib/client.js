"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const ws = new ws_1.default('ws://localhost:8000');
ws.on('error', console.error);
ws.on('open', function open() {
    const array = new Float32Array(5);
    for (var i = 0; i < array.length; ++i) {
        var num = i / 2;
        ws.send(array[i]);
        array[i] = num;
    }
    ws.send(array);
});
