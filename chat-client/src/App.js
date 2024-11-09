// src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

function App() {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Fetch chat history
        axios.get('http://localhost:5000/messages')
            .then(response => setMessages(response.data))
            .catch(error => console.error(error));

        // Listen for incoming messages
        socket.on('message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        // Cleanup on component unmount
        return () => {
            socket.off('message');
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message && username) {
            const newMessage = { username, message };
            socket.emit('message', newMessage);
            setMessage(''); // Clear input after sending
        }
    };

    return (
        <div className="App">
            <h2>Real-Time Chat</h2>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.username}</strong>: {msg.message}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
