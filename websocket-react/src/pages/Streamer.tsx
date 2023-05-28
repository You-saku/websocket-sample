import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { MessageHistory } from '../types/MessageHistory';

const socketUrl = process.env.REACT_APP_WS_HOST || 'ws://localhost:8000';

// map color to price
const ColorPriceMap = new Map<string, number>([
    ["black", 100],
    ["blue", 500],
    ["yellow", 1000],
    ["orange", 5000],
    ["red", 10000],
]);

export const Streamer = () => {
    const [messageHistory, setMessageHistory] = useState<MessageHistory[]>([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    // when start browser
    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
        sendMessage(JSON.stringify({
                'client' : false
            }));
        }
    }, [readyState]);

    // when get message
    useEffect(() => {
        if (lastMessage !== null) {
            const lastMessageJson = stringToJson(lastMessage.data); // convert to JSON (type MessageHistory)
            setMessageHistory((prev) => prev.concat(lastMessageJson));
        }
    }, [lastMessage]);

    return (
        <div>
            {/* comment out */}
            {/* <h2>Streamer</h2> */}
            {/* {lastMessage ? <h3>Chat History</h3> : <h3>Chat Stopped</h3>} */}
            {/* <p>The WebSocket is currently : {connectionStatus}</p> */}

            <ul className="chat-history" style={{padding: '5px'}}>
                {messageHistory.map((message, idx) => (
                <li key={idx} style={{display: 'flex', width: '20%', padding: '5px', marginBottom: '5px', border: `3px solid ${message.color}`, borderRadius: '5px'}}>
                    <span style={{marginRight: '10px', background: '#f5f5f5'}}>{message.username}</span>
                    {/* <span style={{color: `${message.color}`}}>{message.message}</span> */}
                    <span style={{marginLeft: 'auto', textAlign: 'right'}}>{ColorPriceMap.get(message.color)}¥</span>
                </li>
                ))}
            </ul>
        </div>
    );
};

function stringToJson(word: string) {
    return JSON.parse(word);
}
