
import axios from 'axios';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
const socket = io('http://localhost:9999');
import debounce from 'lodash.debounce'
import { RiSendPlaneFill, RiEmojiStickerFill, RiAttachment2, RiVideoAddFill } from 'react-icons/ri';
import { FiPhoneCall } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import pro from '/images/profile.jpeg';
import EmojiPicker from 'emoji-picker-react';

function Home() {




  const [user, setUser] = useState([]);
  const [singleUser, setSingleUser] = useState({});
  const [message, setMessage] = useState([]);
  const [mssg, setMssg] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionUser, setSessionUser] = useState('');
  const token = localStorage.getItem('token');
  const [results, setResults] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
// firebase
const [selectedFile, setSelectedFile] = useState('');
// firebase
  const chatBoxRef = useRef(null);
  const attFileRef = useRef(null);





  // ###############################  friend list ######################################


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



  // ###############################  chat  show ######################################


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


  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleTimeString('en-US', options);
  };




  // ###############################  chat send ######################################


  const chatsend = (e) => {
    e.preventDefault();

    if (selectedUserId) {
      try {
        const newMessage = {
          content: mssg,
          receiverId: selectedUserId,
          senderId: sessionUser.user_id,
          fileUrl:selectedFile,
          timestamp: new Date(),
        };

        console.log('newMessage: ', newMessage);
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

  const addSearch = async (e) => {
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

  const addfriend = async (e) => {
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



  const onEmojiClick = (emojiObject) => {
    setMssg((prevMssg) => prevMssg + emojiObject.emoji);
    setShowPicker(false);
  };;



  // firebase ###############################################

  const uplaodfile = ()=>{
    if (attFileRef.current && attFileRef.current.files.length > 0) {
      setSelectedFile(attFileRef.current.files[0]);
    }
  }


  return (
    <>

      <div className="flex py-4 border sticky top-0 z-10 bg-blue-50 shadow-md">
        <div className="w-1/4 text-center ">


          {/* search start */}

          <div className=' relative'>
            <input
              type="text"
              onChange={addSearch}
              placeholder="Search for friends"
              className='p-2 w-10/12 rounded-lg shadow-sm'
            />
            <div className=' absolute z-10'>
              {results.map((user) => (
                <div key={user.user_id} className=' bg-blue-100 border-b border-blue-50 py-4 px-2' >{user.username} <button type="submit" onClick={addfriend} id={user.user_id}>Add</button></div>
              ))}
            </div>
          </div>


          {/* search end */}
        </div>


        <div className=" w-3/4 flex justify-between">
          {/* chat profile */}
          <div className="chatuser px-5">
            {singleUser.username != undefined ? (
              <Link to={`/user/${singleUser.username}/${singleUser._id}`}>
                <div className="flex">

                  <img src={singleUser.Profile != '' ? `http://localhost:9999/${singleUser.Profile}` : pro} alt="" className='w-10 h-10 rounded-full' />

                  <div className='px-3 text-2xl text-blue-500 font-medium'>
                    {singleUser.username}
                  </div>
                </div>
              </Link>

            ) : ('')}

          </div>

          <div className={`flex justify-end gap-7 text-3xl px-3 text-blue-500 ${selectedUserId ? '' : 'hidden'}`}>
            <FiPhoneCall />
            <RiVideoAddFill />
            <HiDotsVertical />
          </div>

        </div>
      </div>



      <div className='flex'>
        <div className='w-1/4 h-screen bg-blue-100 p-2 border-blue-300 border-r overflow-y-auto'>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error} </div>
          ) : (
            user.map((item) => (
              <div
                className='py-5 ps-5 my-2 rounded-lg bg-blue-300 border-b border-blue-50 shadow-sm flex'
                key={item.user_id}
                id={item.user_id}
                onClick={chatshow}
              >
                <img
                  src={item.Profile !== '' ? `http://localhost:9999/${item.Profile}` : pro}
                  alt=""
                  className='w-10 h-10 rounded-full'
                  onClick={(e) => e.stopPropagation()}
                />
                <div
                  className='font-medium text-gray-800 ps-4 text-lg'
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.username}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="chatbody w-3/4 h-screen bg-blue-100 relative " >

          {/* 11 */}

          <div className="chatbox overflow-auto" ref={chatBoxRef}>
            {message.map((mg, i) => {
              const isNewBlock = i === 0 || message[i - 1].senderId !== mg.senderId;
              const formattedTime = formatTimestamp(mg.timestamp);

              return (
                <div key={i} className={`flex ${mg.senderId === selectedUserId ? 'justify-start' : 'justify-end'} gap-2`}>
                  {isNewBlock && mg.senderId === selectedUserId ? (
                    <img
                      src={singleUser.Profile !== '' ? `http://localhost:9999/${singleUser.Profile}` : pro}
                      alt="User Profile"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10"></div>
                  )}

                  <div className="flex flex-col">
                    <div
                      className={`${mg.senderId === selectedUserId ? 'bg-slate-50 text-gray-700' : 'bg-blue-400 text-white me-2'} ms-1 mt-1 mb-2 p-3 rounded-lg shadow-sm relative pe-12`}
                    >
                      {mg.content} <span className='text-[9px] absolute right-2 bottom-[-1px]'>{formattedTime}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>


          {/* 11 */}


          <div className={`chatsend fixed flex justify-start gap-5  bottom-0 text-center p-5 bg-white w-3/4 ${selectedUserId ? 'block' : 'hidden'}`}>
          <input type="file" name="attFile" id="" className='hidden' ref={attFileRef} onChange={uplaodfile}/>
            <button><RiAttachment2 className='text-3xl mt-1 text-blue-500'  onClick={()=>attFileRef.current.click()}/> </button>
            <input
              type="text"
              name="mssg"
              value={mssg}
              id="mssg"
              className='w-11/12 p-3 rounded-lg '
              placeholder='Type your message and press enter'
              onChange={(e) => setMssg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  chatsend(e);
                }
              }}
            />


            <div className='flex px-2 pt-1 justify-evenly'>
              <button><RiSendPlaneFill className='text-4xl mx-2 text-blue-500' onClick={chatsend} /></button>

              <button>  <RiEmojiStickerFill className='text-4xl mx-2  text-blue-500' onClick={() => setShowPicker((val) => !val)} /></button>
            </div>


          </div>
          {showPicker && (
            <div className="emoji-picker-container">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;

// 