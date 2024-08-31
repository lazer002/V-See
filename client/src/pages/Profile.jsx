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
      const response = await axios.post(`http://localhost:9999/userProfile`, {userId: userId });
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
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <>
      <button>✎</button>

      <div className="profile_fild">
        <span id="profile_edit" onClick={() => fileInputRef.current.click()}>✎</span>

        <div className="profile_icon">
          <img
            src={image}
            // showUser?.Profile ? `http://localhost:9999/${showUser.Profile}` : image
            alt="profile"
            id="profile_image"
          />
        </div>

        <input
          type="file"
          name="Profile"
          id="Profile"
          ref={fileInputRef}
          onChange={imageSrc}
          style={{ display: 'none' }}
        />
      </div>

      <div>
        <input
          type="text"
          name="username"
          value={showUser.username || ''}
          onChange={(e) => setShowUser({ ...showUser, username: e.target.value })}
        />
      </div>

      <div>
        <input
          type="text"
          name="email"
          value={showUser.email || ''}
          onChange={(e) => setShowUser({ ...showUser, email: e.target.value })}
        />
      </div>

      <button type="submit" onClick={updateDetails}>Save</button>
    </>
  );
}

export default Profile;
