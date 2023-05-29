import { useState, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { MessageHistory } from '../types/MessageHistory';

const socketUrl = process.env.REACT_APP_WS_HOST || 'ws://localhost:8000';

// map color to price
const ColorPriceMap = new Map<string, number>([
    ["black", 100],
    ["orange", 1000],
    ["red", 10000],
]);

// map color to grade
const ColorGradeMap = new Map<string, string>([
    ["black", '梅'],
    ["orange", '竹'],
    ["red", '松'],
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

    // ref ul element
    const chatHistoryRef = useRef<HTMLUListElement>(null);

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
            setMessageHistory([lastMessageJson, ...messageHistory]);
        }
    }, [lastMessage]);

    // add message to chat history
    useEffect(() => {
        const chatHistoryElement = chatHistoryRef.current;
        if (chatHistoryElement) {
            //chatHistoryElement.scrollTo(0, chatHistoryElement.scrollHeight);
            chatHistoryElement.scrollTo(0, 0);
        }
    }, [messageHistory]);

    return (
        <div>
            <ul  id='chat-history' style={{padding: '5px', overflowX: 'hidden', overflowY: 'scroll', height: '400px'}} ref={chatHistoryRef}>
                {messageHistory.map((message, idx) => (
                <li key={idx} style={{ width: '20%', marginBottom: '5px', border: `3px solid ${message.color}`, borderRadius: '5px'}}>
                    <div>
                        <p style={{padding: '0px', margin: '0px', display: 'grid', gridTemplateColumns: '2fr 1fr', color: 'white', background: `${message.color}`}}>
                            <span>{message.username}さん</span>
                            <span>{ColorGradeMap.get(message.color)}コース</span>
                        </p>
                        <p style={{padding: '0px', margin: '10px', display: 'grid', gridTemplateColumns: '2fr 1fr'}}> 
                            <span> {message.text === '' ? 'ご支援' : message.text}</span>
                            <span>¥{ColorPriceMap.get(message.color)}</span>
                        </p>
                    </div>
                </li>
                ))}
            </ul>
        </div>
    );
};

function stringToJson(word: string) {
    return JSON.parse(word);
}
