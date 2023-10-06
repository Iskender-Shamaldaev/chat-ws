import {useEffect, useRef, useState} from "react";
import {ChatMessage, IncomingMessage} from "../type";

function App() {

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageText, setMessageText] = useState("");
    const [usernameText, setUsernameText] = useState("");
    const [isLoggedIn, setLoggedIn] = useState(false);

    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/chat');

        ws.current.onclose = () => console.log("ws closed");

        ws.current.onmessage = event => {
            const decodedMessage = JSON.parse(event.data) as IncomingMessage;

            if (decodedMessage.type === 'NEW_MESSAGE') {
                setMessages((messages) => [...messages, decodedMessage.payload]);
            }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        }
    }, []);

    const changeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsernameText(e.target.value);
    };

    const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageText(e.target.value);
    };

    const setUsername = (e: React.FormEvent) => {
        e.preventDefault();

        if (!ws.current) return;

        ws.current.send(JSON.stringify({
            type: 'SET_USERNAME',
            payload: usernameText
        }));
        setLoggedIn(true);
    };
    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!ws.current) return;

        ws.current.send(JSON.stringify({
            type: 'SEND_MESSAGE',
            payload: messageText
        }));
    };

    let chat = (
        <div>
            {messages.map((message, idx) => (
                <div key={idx}>
                    <b>{message.username}: </b>
                    {message.text}
                </div>
            ))}

            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    name="messageText"
                    value={messageText}
                    onChange={changeMessage}
                />
                <input type="submit" value="Send" />
            </form>
        </div>
    );


    if (!isLoggedIn) {
        chat = (
            <form onSubmit={setUsername}>
                <input
                    type="text"
                    name="username"
                    value={usernameText}
                    onChange={changeUsername}
                />
                <input type="submit" value="Enter Chat" />
            </form>
        );
    }


    return (
        <div className="App">
            {chat}
        </div>
    );
}

export default App;

