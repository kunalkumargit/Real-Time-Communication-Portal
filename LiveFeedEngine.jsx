import {useState, useEffect} from 'react';

function LiveFeedEngine() {
    const [connections, setConnections] = useState('CONNECTING');
    const [messagelog, setMessageLog] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [ws, setWs] = useState(null);
/*wss://echo.websocket.events this echo server is always showing desconnectec so it use diffrent echo test server*/ 
    useEffect( () => {
        const ws = new WebSocket('wss://ws.postman-echo.com/raw');
        setWs(ws);
        
        // connection of websocket to server
        ws.onopen = () => {
            setConnections('CONNECTED');
            console.log(' connected !');
        };
        ws.onmessage = (event) => {
            setMessageLog((prev) => [...prev, event.data]);
        };
        ///// when websocket connection is lost with server then it will show the error in browser
        ws.onerror = (error) => {
            console.log("error", error);
        };
        ws.onclose = () => {
            setConnections("Connection Lost. Attempting to reconnect...");
            console.log("Connection Lost. Attempting to reconnect...");
        };

        return () => {
            ws.close();
        };
    },[]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(inputMessage);
            setInputMessage('');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Real-Time Communication Portal</h2>

            <p>
                Connection Status: <strong style={{ color: connections === 'CONNECTED' ? 'green' : 'red' }}>
                    {connections}
                </strong>
            </p>

            <form onSubmit={handleSendMessage} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{ padding: '8px', width: '250px', marginRight: '8px' }}
                />
                <button type="submit" style={{ padding: '8px 16px' }}>
                    Send
                </button>
            </form>

            <h3>Messages</h3>

            {messagelog.length === 0 ? (
                <p>No messages yet.</p>
            ) : (
                <ul>
                    {messagelog.map((message, index) => (
                        <li key={index} style={{ color: 'green' }}>
                            {message}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default LiveFeedEngine;


