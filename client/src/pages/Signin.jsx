import React, { useState,useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Signin() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: '', password: '' });
  const {isLoggedIn , login } = useContext(AuthContext);

  const handleInp = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const postData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9999/signin', user); 
      console.log('response: ', response);
      if(response.status!=200){
      console.log(response.data.msg,'fff');
      
     }else{
      localStorage.setItem('token', response.data.token);
      login(response.data.token);    
     }
    } catch (error) {
      console.error('Login failed', error);
    }
  };
  if (isLoggedIn) {
    return <useNavigate to="/" />;
  }
  return (
    <>
      <h1>Signin Page</h1>
      <form onSubmit={postData}>
        <input type="text" name="email" value={user.email} onChange={handleInp} placeholder="Email" />
        <input type="password" name="password" value={user.password} onChange={handleInp} placeholder="Password" />
        <button type="submit">Sign In</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </>
  );
}

export default Signin;
