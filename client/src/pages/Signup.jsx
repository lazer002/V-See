import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '', password: '', username: ''
  });

  const handleInp = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const subData = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.post('http://localhost:9999/signup', user);
      localStorage.setItem('token', data.data.token);
      navigate('/signin');
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  const googleAuth = () => {
    window.location.href = 'http://localhost:9999/auth/google/';
  };

  return (
    <>
      <h4>User SignUp</h4>
      <input type='email' name="email" id="email" value={user.email} onChange={handleInp} />
      <input type="password" name="password" id="password" value={user.password} onChange={handleInp} />
      <input type="text" name="username" min={6} max={12} id="username" value={user.username} onChange={handleInp} />
      <button type="submit" onClick={subData}>Submit</button>
      <p onClick={googleAuth} style={{ cursor: 'pointer',border:'1px solid black',width:'fit-content',padding:'4px' }}>Sign Up with Google</p>
      <p>I already have an account <Link to="/signin">Sign In</Link></p>
    </>
  );
}

export default Signup;
