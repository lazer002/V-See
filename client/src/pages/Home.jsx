import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [user, setUser] = useState([]);
  const [singleUser, setSingleUser] = useState({});
  const [message, setMessage] = useState([]);
  const [mssg, setMssg] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


// ##########################  sidebar user  #############################



  const userdata = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:9999/getuser');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    userdata();
  }, []);


// ##########################  sidebar user  #############################




// ##########################  mesage show on click  #############################


  const chatshow = async (e) => {
    try {
      const token = localStorage.getItem('token');
      const userString = e.currentTarget.getAttribute('data-user');
      const userObject = JSON.parse(userString);
      setSingleUser(userObject)
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

      const allMessages = response.data.flatMap(chat => chat.messages);
  
      setMessage(allMessages);
    } catch (error) {
      console.log('Error fetching messages: ', error);
    }
  };
  

// ##########################  mesage show on click  #############################



// ##########################  mesage send #############################

  const chatsend = async (e) => {
    e.preventDefault();
  
    if (selectedUserId) {
      try {
        const token = localStorage.getItem('token');
  
        const response = await axios.post(
          'http://localhost:9999/createChat',
          {
            content: mssg,
            receiverId: selectedUserId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const updatedMessages = response.data.chat.messages;
        setMessage(updatedMessages);
        setMssg('');
      } catch (error) {
        console.log('Error sending message: ', error);
        alert('Failed to send message. Please try again.');
      }
    } else {
      alert('Please select a user to chat with.');
    }
  };

// ##########################  mesage send #############################




  return (
    <>


      <div style={{ display: 'flex' }}>
        <ul>
          {loading ? (
            <li>Loading...</li>
          ) : error ? (
            <li>{error}</li>
          ) : (
            user.map((item) => (
              <li
                style={{ border: '1px solid black', width: '30vw', height: '60px', listStyle: 'none' }}
                key={item.user_id}
                id={item.user_id}
                data-user={JSON.stringify(item)}
                onClick={chatshow}
              >
                {item.username}
              </li>
            ))
          )}
        </ul>

        <div className="chatbody" style={{ position: 'relative' }}>
          <div className="chatuser"> 
          <Link to={`/user/${singleUser.username}/${singleUser._id}`}>
          {singleUser.username}</Link> 
            </div>
          <div className="chatbox" style={{ border: '1px solid black', width: '60vw', height: '90vh', overflowY: 'auto' }}>
  

{message.map((mg, i) => (
  <div 
    key={i} 
    style={{
      display: 'flex', 
      justifyContent: mg.senderId === selectedUserId ? 'flex-start' : 'flex-end'
    }}
  >
    <div 
      style={{ 
        backgroundColor: mg.senderId === selectedUserId ? 'black' : 'green', 
        margin: '4px', 
        padding: '10px', 
        borderRadius: '10px', 
        color: 'white', 
        maxWidth: '60%', 
      }}
    >
      {mg.content}
    </div>
  </div>
))}

          </div>
          <div className="chatsend">
            <input
              type="text"
              name="mssg"
              value={mssg}
              id="mssg"
              style={{ width: '40vw', height: '4vh' }}
              onChange={(e) => setMssg(e.target.value)}
            />
            <button
              type="submit"
              onClick={chatsend}
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
