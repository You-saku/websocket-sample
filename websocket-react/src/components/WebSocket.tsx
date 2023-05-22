import { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export const WebSocketDemo = () => {
  //Public API that will echo messages sent to it back to the client
const [socketUrl, setSocketUrl] = useState('ws://localhost:8000');
        
const [messageHistory, setMessageHistory] = useState<MessageEvent[]>([]);

const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

useEffect(() => {
    if (lastMessage !== null) {
        setMessageHistory((prev) => prev.concat(lastMessage));
    }
}, [lastMessage]);

const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);

const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
}[readyState];

return (
        <div>
            <button
                onClick={handleClickSendMessage}
                disabled={readyState !== ReadyState.OPEN}
            >
                Click Me to send 'Hello'
            </button>
            <p>The WebSocket is currently : {connectionStatus}</p>
            {lastMessage ? <h2>chat start</h2> : <h2>chat stop.</h2>}
            <ul>
            {messageHistory.map((message, idx) => (
                <p key={idx}>{message ? message.data : null}</p>
            ))}
            </ul>
        </div>
    );
};
