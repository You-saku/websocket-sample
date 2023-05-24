import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

// get random name
const getName = () => {
    const names = [
        'Bob', 'John', 'Smith', 'Doe', 'Adam', 'Emily',
        'Alice', 'Eve', 'Carol', 'David', 'Frank', 'George',
    ];

    const name = names[Math.floor(Math.random() * names.length)];
    return name;
}

const socketUrl = process.env.REACT_APP_WS_HOST || 'ws://localhost:8080';
const username = getName();

export const WebSocketDemo = () => {
    const [messageHistory, setMessageHistory] = useState<MessageEvent[]>([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
    const [message , setMessage] = useState<string>('');

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
        }
    }, [lastMessage]);

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const handleClickSendMessage = () => {
        sendMessage(JSON.stringify({'username' : username, 'message' : message}));
        setMessage('');
    }

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return (
        <div>
            <p>The WebSocket is currently : {connectionStatus}</p>
            <form onSubmit={e => e.preventDefault()}>
                <input  type="text" 
                        id="message"
                        placeholder="Enter message"
                        value={message}
                        onChange={handleMessageChange}
                />
                <button
                    onClick={handleClickSendMessage}
                    disabled={readyState !== ReadyState.OPEN}
                >
                    Send Message
                </button>
            </form>
            <p>Your Name: {username}</p>
            {lastMessage ? <h2>Chat History</h2> : <h2>Chat Stopped</h2>}
            <ul>
            {messageHistory.map((message, idx) => (
                <p key={idx}>{message ? message.data : null}</p>
            ))}
            </ul>
        </div>
    );
};
