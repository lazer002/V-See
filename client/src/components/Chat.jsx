// Chat.jsx
import React, { useEffect, useRef, useState } from 'react';
import { RiSendPlaneFill, RiEmojiStickerFill, RiAttachment2 } from 'react-icons/ri';
import { FiPhoneCall } from 'react-icons/fi';
import { HiDotsVertical } from 'react-icons/hi';
import EmojiPicker from 'emoji-picker-react';

function Chat({ selectedUser, messages, onSend, onFileUpload, onEmojiClick, showPicker, setShowPicker }) {
  const chatBoxRef = useRef(null);
  const attFileRef = useRef(null);

  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="chatbody w-3/4 h-screen bg-blue-100 relative">
      <div className="chatbox overflow-auto" ref={chatBoxRef}>
        {messages.map((msg, i) => {
          const isNewBlock = i === 0 || messages[i - 1].senderId !== msg.senderId;
          const formattedTime = new Date(msg.timestamp).toLocaleTimeString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          return (
            <div key={i} className={`flex ${msg.senderId === selectedUser._id ? 'justify-start' : 'justify-end'} gap-2`}>
              {isNewBlock && msg.senderId === selectedUser._id ? (
                <img
                  src={selectedUser.Profile !== '' ? `http://localhost:9999/${selectedUser.Profile}` : '/images/profile.jpeg'}
                  alt="User Profile"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10"></div>
              )}
              <div className="flex flex-col">
                <div
                  className={`${msg.senderId === selectedUser._id ? 'bg-slate-50 text-gray-700' : 'bg-blue-400 text-white me-2'} ms-1 mt-1 mb-2 p-3 rounded-lg shadow-sm relative pe-12`}
                >
                  {msg.content}
                  <span className='text-[9px] absolute right-2 bottom-[-1px]'>{formattedTime}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`chatsend fixed flex justify-start gap-5 bottom-0 text-center p-5 bg-white w-3/4 ${selectedUser ? 'block' : 'hidden'}`}>
        <input type="file" ref={attFileRef} className='hidden' onChange={onFileUpload} />
        <button><RiAttachment2 className='text-3xl mt-1 text-blue-500' onClick={() => attFileRef.current.click()} /></button>
        <input
          type="text"
          className='w-11/12 p-3 rounded-lg'
          placeholder='Type your message and press enter'
          onChange={(e) => onSend(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSend(e.target.value);
            }
          }}
        />
        <div className='flex px-2 pt-1 justify-evenly'>
          <button><RiSendPlaneFill className='text-4xl mx-2 text-blue-500' onClick={() => onSend()} /></button>
          <button><RiEmojiStickerFill className='text-4xl mx-2 text-blue-500' onClick={() => setShowPicker(val => !val)} /></button>
        </div>
      </div>
      {showPicker && (
        <div className="emoji-picker-container">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
}

export default Chat;
