import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { MessageHistory } from '../types/MessageHistory';

const socketUrl = process.env.REACT_APP_WS_HOST || 'ws://localhost:8000';

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
            <h2>Streamer</h2>
            {lastMessage ? <h3>Chat History</h3> : <h3>Chat Stopped</h3>}
            <p>The WebSocket is currently : {connectionStatus}</p>
            <ul>
            {messageHistory.map((message, idx) => (
                <li key={idx} style={{margin: '5px', border: '1px solid black', width: '25%', listStyleType: 'none'}}>
                    <span style={{color: message.color}}>
                        {message.username}
                    </span>
                    <span>
                        : {message.message}
                    </span>
                </li>
            ))}
            </ul>
        </div>
    );
};

function stringToJson(word: string) {
    return JSON.parse(word);
}
