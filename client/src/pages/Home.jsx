
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

// Initialize Socket.IO
const socket = io('http://localhost:9999', { withCredentials: true });

function Home() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch users data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:9999/getuser');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);



const handleUserSelect = async (e) => {
  try {
    const token = localStorage.getItem('token');
    const userString = e.currentTarget.getAttribute('data-user');
    const userObject = JSON.parse(userString);
    setSelectedUser(userObject);
    setSelectedUserId(userObject.user_id);

    const response = await axios.post(
      'http://localhost:9999/getmessage',
      { receiverId: userObject.user_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const allMessages = response.data.flatMap((chat) => chat.messages);
    setMessages(allMessages);
  } catch (error) {
    console.log('Error fetching messages:', error);
  }
};

// Send a new message
const handleSendMessage = async (e) => {
  e.preventDefault();

  if (selectedUserId) {
    try {
      const token = localStorage.getItem('token');
      const messageData = {
        content: messageInput,
        receiverId: selectedUserId,
      };

      socket.emit('message', {
        ...messageData,
        senderId: token, // Ensure the sender ID is correct
      });

      await axios.post(
        'http://localhost:9999/createChat',
        messageData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, senderId: token, timestamp: new Date() },
      ]);

      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  } else {
    alert('Please select a user to chat with.');
  }
};

// Handle incoming messages in real-time using Socket.IO
useEffect(() => {
  socket.on('message', (newMessage) => {
    if (selectedUserId) {
      setMessages((prevMessages) => [
        ...prevMessages,
        newMessage,
      ]);
    }
  });

  return () => {
    socket.off('message');
  };
}, [selectedUserId]);

return (
  <>
    <div style={{ display: 'flex' }}>
      {/* User list */}
      <ul>
        {loading ? (
          <li>Loading...</li>
        ) : error ? (
          <li>{error}</li>
        ) : (
          users.map((user) => (
            <li
              style={{
                border: '1px solid black',
                width: '30vw',
                height: '60px',
                listStyle: 'none',
              }}
              key={user.user_id}
              data-user={JSON.stringify(user)}
              onClick={handleUserSelect}
            >
              {user.username}
            </li>
          ))
        )}
      </ul>

      {/* Chat box */}
      <div className="chatbody" style={{ position: 'relative' }}>
        {/* Selected user display */}
        <div className="chatuser">
          {selectedUser.username && (
            <Link to={`/user/${selectedUser.username}/${selectedUser._id}`}>
              {selectedUser.username}
            </Link>
          )}
        </div>
        
        {/* Messages display */}
        <div
          className="chatbox"
          style={{
            border: '1px solid black',
            width: '60vw',
            height: '90vh',
            overflowY: 'auto',
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: msg.senderId === selectedUserId ? 'flex-start' : 'flex-end',
              }}
            >
              <div
                style={{
                  backgroundColor: msg.senderId === selectedUserId ? 'black' : 'green',
                  margin: '4px',
                  padding: '10px',
                  borderRadius: '10px',
                  color: 'white',
                  maxWidth: '60%',
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        
        {/* Message input and send button */}
        <div className="chatsend">
          <input
            type="text"
            name="message"
            value={messageInput}
            id="message"
            style={{ width: '40vw', height: '4vh' }}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button
            type="submit"
            onClick={handleSendMessage}
            style={{ width: '10vw', height: '4vh' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </>
);
}

export default Home;
