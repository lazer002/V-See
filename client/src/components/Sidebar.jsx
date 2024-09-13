import React, { useState } from 'react';
import { FaHome, FaUser, FaEnvelope } from 'react-icons/fa';

function Sidebar() {
  const HomeContent = () => <div>Home Tab Content</div>;
  const ProfileContent = () => <div>Profile Tab Content</div>;
  const MessagesContent = () => <div>Messages Tab Content</div>;

  const [activeTab, setActiveTab] = useState('home');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex">
      {/* Vertical Sidebar */}
      <div className="w-14 bg-gray-800 h-screen flex flex-col items-center py-4">
        <div
          className={`cursor-pointer text-white mb-6 ${
            activeTab === 'home' ? 'text-blue-500' : ''
          }`}
          onClick={() => handleTabClick('home')}
        >
          <FaHome size={24} />
        </div>
        <div
          className={`cursor-pointer text-white mb-6 ${
            activeTab === 'profile' ? 'text-blue-500' : ''
          }`}
          onClick={() => handleTabClick('profile')}
        >
          <FaUser size={24} />
        </div>
        <div
          className={`cursor-pointer text-white mb-6 ${
            activeTab === 'messages' ? 'text-blue-500' : ''
          }`}
          onClick={() => handleTabClick('messages')}
        >
          <FaEnvelope size={24} />
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {activeTab === 'home' && <HomeContent />}
        {activeTab === 'profile' && <ProfileContent />}
        {activeTab === 'messages' && <MessagesContent />}
      </div>
    </div>
  );
}

export default Sidebar;
