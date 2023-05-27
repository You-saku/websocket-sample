import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { MessageHistory } from '../types/MessageHistory';

// get random name
const getName = () => {
    const names = [
        'Bob', 'John', 'Smith', 'Doe', 'Adam', 'Emily',
        'Alice', 'Eve', 'Carol', 'David', 'Frank', 'George',
    ];
    const name = names[Math.floor(Math.random() * names.length)];

    return name;
}

const socketUrl = process.env.REACT_APP_WS_HOST || 'ws://localhost:8000';
const username = getName();

export const Client = () => {
    const [messageHistory, setMessageHistory] = useState<MessageHistory[]>([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
    const [message , setMessage] = useState<string>('');
    const [color, setColor] = useState<string>('black');
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
                'client' : true
            }));
        }
    }, [readyState]);

    // when change message
    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    // when change color
    const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setColor(e.target.value);
    };

    // when submit message
    const handleClickSendMessage = () => {
        // send json to server via websocket
        sendMessage(JSON.stringify({
            'client' : true,
            'username' : username,
            'message' : message,
            'color' : color
        }));
        setMessage('');
    }

    return (
        <div>
            <h2>Your Name is {username}</h2>
            <p>The WebSocket is currently : {connectionStatus}</p>
            <form onSubmit={e => e.preventDefault()}>
                <input  type="text" 
                        id="message"
                        placeholder="Enter message"
                        value={message}
                        onChange={handleMessageChange}
                />
                <select value={color} onChange={handleColorChange}>
                    <option value="black">free</option>
                    <option value="blue">500</option>
                    <option value="yellow">1000</option>
                    <option value="orange">5000</option>
                    <option value="red">10000</option>
                </select>
                <button onClick={handleClickSendMessage} disabled={readyState !== ReadyState.OPEN}>
                    Send Message
                </button>
            </form>
            <ul>
            {messageHistory.map((message, idx) => (
                <p key={idx}>
                    <span style={{color: message.color}}>{message.username} : {message.message}</span>
                </p>
            ))}
            </ul>
        </div>
    );
};

function stringToJson(word: string) {
    return JSON.parse(word);
}
