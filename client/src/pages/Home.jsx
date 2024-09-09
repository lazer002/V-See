
import axios from 'axios';
import React, { useEffect, useState, useRef,useCallback } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
const socket = io('http://localhost:9999'); 
import debounce from 'lodash.debounce'
import { RiSendPlaneFill ,RiEmojiStickerFill   } from 'react-icons/ri';
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
       <div className="flex py-4 border sticky top-0 z-10 bg-slate-400">
        <div className="w-1/3 text-center">


{/* search start */}
    
 <div className=' relative'>
      <input 
        type="text"  
        onChange={addSearch} 
        placeholder="Search for friends" 
        className='p-2 w-8/12 rounded-lg' 
      />
      <div className=' absolute z-10'>
        {results.map((user) => (
          <div key={user.user_id} className=' bg-blue-100 border-b border-blue-50 py-4 px-2' >{user.username} <button type="submit" onClick={addfriend}  id={user.user_id}>Add</button></div>
        ))}
      </div>
    </div>


{/* search end */}
</div>


<div className=" w-2/3 ">
          {/* chat profile */}
          <div className="chatuser ">
            <Link to={`/user/${singleUser.username}/${singleUser._id}`}>
            <div className="flex">
            <div>
            <img src={`http://localhost:9999/${singleUser.profile}`} alt="" />  
              </div>
              <div>
              {singleUser.username}
              </div>
            </div> 
            </Link>
          </div>

        </div>
      </div>



      <div style={{ display: 'flex' }}>
        <div className='w-1/3 h-screen bg-blue-100 p-2'>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div><button> Add friend + </button> </div>
          ) : (
            user.map((item) => (
              <div
                className='py-5 my-2 rounded-lg bg-blue-200 border-b border-blue-50'
                key={item.user_id}
                id={item.user_id}
                onClick={chatshow}
              >
                {item.username}
              </div>
            ))
          )}
        </div>

        <div className="chatbody w-2/3 h-screen bg-blue-100 relative" >
 
          <div
            className="chatbox"
            ref={chatBoxRef}
          >
            {message.map((mg, i) => (
          <div
          key={i}
          id={i}
          className={`flex ${mg.senderId === selectedUserId ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`${
              mg.senderId === selectedUserId ? 'bg-black' : 'bg-green-500'
            } m-1 p-2 rounded-lg text-white max-w-[60%]`}
          >
            {mg.content}
          </div>
        </div>
        
            ))}
          </div>
          <div className="chatsend fixed flex justify-center gap-5 bottom-0 text-center py-5 bg-slate-300 w-2/3">
            <input
              type="text"
              name="mssg"
              value={mssg}
              id="mssg"
            className='w-3/4 py-3 rounded-lg'
              onChange={(e) => setMssg(e.target.value)}
            />
            <button
              type="submit"
              onClick={chatsend}
              style={{ width: '10vw', height: '4vh' }}
            >
            <RiSendPlaneFill  className='text-4xl'/>
            </button>
            <RiEmojiStickerFill  className='text-4xl mt-1' onClick={() => setShowPicker((val) => !val)}/>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;