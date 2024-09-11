import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import pro from '/images/profile.jpeg';

function Profile() {
  const fileInputRef = useRef(null);
  const userprm = useParams();
  const userId = userprm.id;

  const [showUser, setShowUser] = useState({});
  const [image, setImage] = useState(pro);
  const [imageFile, setImageFile] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await axios.post(`http://localhost:9999/userProfile`, { userId });
      setShowUser(response.data);

      if (response.data.Profile) {
        setImage(`http://localhost:9999/${response.data.Profile}`);
      } else {
        setImage(pro);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const imageSrc = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      const objectUrl = URL.createObjectURL(selectedFile);
      setImage(objectUrl);
      setImageFile(selectedFile);

      setShowUser((prevState) => ({
        ...prevState,
        Profile: objectUrl,
      }));
    }
  };

  const updateDetails = async () => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('username', showUser.username || '');
      formData.append('email', showUser.email || '');

      if (imageFile) {
        formData.append('Profile', imageFile);
      }

      const response = await axios.post(`http://localhost:9999/updateUser`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowUser(response.data);

      if (response.data.Profile) {
        setImage(`http://localhost:9999/${response.data.Profile}`);
      }
      alert('Profile updated!');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    
    <div className="container mx-auto py-10 px-4">
            <button
            className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer"
            onClick={(e) => console.log(e)}
          >
          fwafwa
          </button>
      <div className="bg-blue-400 shadow-md rounded-lg p-6 max-w-lg mx-auto">
        <div className="flex justify-center mb-6 relative">
          <img
            src={image}
            alt="profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 shadow-md"
          />
          <button
            className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            ✎
          </button>
        </div>

        <input
          type="file"
          name="Profile"
          id="Profile"
          ref={fileInputRef}
          onChange={imageSrc}
         className='hidden'
        />

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={showUser.username || ''}
            onChange={(e) => setShowUser({ ...showUser, username: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={showUser.email || ''}
            onChange={(e) => setShowUser({ ...showUser, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          onClick={updateDetails}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md transition duration-200"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default Profile;
