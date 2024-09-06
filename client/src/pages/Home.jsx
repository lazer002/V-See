
import axios from 'axios';
import React, { useEffect, useState, useRef,useCallback } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
const socket = io('http://localhost:9999'); 
import debounce from 'lodash.debounce'
function Home() {




  const [user, setUser] = useState([]);
  const [singleUser, setSingleUser] = useState({});
  const [message, setMessage] = useState([]);
  const [mssg, setMssg] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionUser, setSessionUser] = useState('');

  const chatBoxRef = useRef(null);
  const token = localStorage.getItem('token');

  const [results, setResults] = useState([]);



  const userdata = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:9999/getuser', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.data);
      setSessionUser(response.data.user)
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


  const chatshow = async (e) => {

    const userId = e.target.id;

  
    setSelectedUserId(userId);

    socket.emit('joinRoom', userId);

    try {
     
      const response = await axios.post(
        'http://localhost:9999/getmessage',
        { receiverId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSingleUser(response.data.userdata[0]);
      const allMessages = response.data.data.flatMap(chat => chat.messages);
      setMessage(allMessages);
    } catch (error) {
      console.log('Error fetching messages: ', error);
    }
  };

  useEffect(() => {
    socket.on('receiveMessage', (incomingMessage) => {
      if (incomingMessage.senderId !== sessionUser.user_id || incomingMessage.receiverId === selectedUserId) {
        setMessage(prevMessages => [...prevMessages, incomingMessage]);
      }
    });
  
    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedUserId, sessionUser.user_id]);
  
   
  const chatsend = (e) => {
    e.preventDefault();
  
    if (selectedUserId) {
      try {
        const newMessage = {
          content: mssg,
          receiverId: selectedUserId,
          senderId: sessionUser.user_id, 
          timestamp: new Date(),
        };
  
        socket.emit('sendMessage', newMessage);
  
   
        setMssg('');
  
      } catch (error) {
        console.log('Error sending message: ', error);
        alert('Failed to send message. Please try again.');
      }
    } else {
      alert('Please select a user to chat with.');
    }
  };
  

  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [message]);



// #############################  search friend ######################
// const debouncedSearch = useCallback(debounce((input) => addSearch(input), 300), []);

const addSearch = async(e)=>{
  const userkey = e.target.value
    debouncedAddSearch(userkey); 
}

const debouncedAddSearch = useCallback(
    debounce(async (userkey) => {
      try {
        if (userkey.trim() === '') {
          setResults([]);
          return;
        }
        const response = await axios.post(
          'http://localhost:9999/searchfriend',
          { userkey },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResults(response.data.data);
      } catch (error) {
        console.error('Error searching for users:', error);
        setResults([]);
      }
    }, 1000), 
    []
  );



  // ###############################  add friend ######################################

  const addfriend =async (e)=>{
const userId = e.target.id
try {

  const response = await axios.post(
    'http://localhost:9999/addfriend',
    { userId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
} catch (error) {
  console.error('Error cant add user:', error);

}
  }



  return (
    <>

{/* search start */}
    
 <div style={{position:'relative'}}>
      <input 
        type="text"  
        onChange={addSearch} 
        placeholder="Search for friends" 
        style={{ position: 'relative', zIndex: 10 }} 
      />
      <div style={{ position: 'absolute', zIndex: 10 }}>
        {results.map((user) => (
          <div key={user.user_id} style={{backgroundColor:'gray', padding:'10px 15px'}} >{user.username} <button type="submit" onClick={addfriend}  id={user.user_id}>Add</button></div>
        ))}
      </div>
    </div>


{/* search end */}



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
              {singleUser.username}
            </Link>
          </div>
          <div
            className="chatbox"
            style={{ border: '1px solid black', width: '60vw', height: '90vh', overflowY: 'auto' }}
            ref={chatBoxRef}
          >
            {message.map((mg, i) => (
              <div
                key={i}
                id={i}
                style={{
                  display: 'flex',
                  justifyContent: mg.senderId === selectedUserId ? 'flex-start' : 'flex-end',
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
