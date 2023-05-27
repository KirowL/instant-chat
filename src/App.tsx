import { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Connects to the socket

interface IMessage {
  sender: string;
  message: string;
  date: Date;
}

function App() {
  const [messages, setMessages] = useState<IMessage[]>([]); 
  const [username, setUsername] = useState<string>('');
  const [messageInput, setMessageInput] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    socket.on('message', (message: IMessage) => {
      setMessages([...messages, message]);
    });

    socket.on('retrieveMessages', (messages: IMessage[]) => {
      setMessages(messages);
    });

    socket.on('error', (error: string) => {
      setErrorMessage(error);
    });
  }, [messages]);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value);
  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => setMessageInput(event.target.value);
  const handleSubmit = () => {
    if (username.length === 0) return setErrorMessage('Please enter a username');
    if (messageInput.length === 0) return setErrorMessage('Please enter a message');
    const message: IMessage = {
      sender: username,
      message: messageInput,
      date: new Date()
    };
    socket.emit('sendMessage', message, () => setMessageInput('')); // send message to server
  };

  return (
    <div className="App">
      <h1>Simple chat application</h1>
      {errorMessage.length > 0 && <div className='error'>{errorMessage}</div>}
      <input type="text" placeholder="Enter your username..."  value={username} onChange={handleUsernameChange} />
      <div className="chat-history">
        {messages.map((message, index) => (
          <div key={index} className="chat-message">
            <div className="message-header">
              <span className="message-sender">{message.sender}</span>
            </div>
            <p className="message-content">{message.message}</p>
          </div>
        ))
        }
      </div>
      <div className="chat-input">
        <input type="text" placeholder="Enter your message..." value={messageInput} onChange={handleMessageChange}/>
        <button onClick={handleSubmit}>Send</button>
      </div>
    </div>
  );
}

export default App;
