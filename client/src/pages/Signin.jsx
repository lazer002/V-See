

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signin() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: '', password: '' });
  const { isLoggedIn, login } = useContext(AuthContext);

  const handleInp = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const postData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9999/signin', user);
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        login(response.data.token);
        toast.success("Signin successful!");
        navigate('/'); 
      } else {
        console.log(response.data.msg, 'Error message');
        toast.error(response?.data?.msg || 'Details Not Match' );
      }
    } catch (error) {
      console.error('Login failed', error);
      toast.error(error.response?.data?.msg || 'Login failed' );
    }
  };

  if (isLoggedIn) {
    navigate('/');
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-400">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg transform transition-transform hover:scale-105">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
        <form onSubmit={postData} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              value={user.email}
              onChange={handleInp}
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-transform hover:bg-gray-50"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={user.password}
              onChange={handleInp}
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-transform hover:bg-gray-50"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">Sign Up</Link>
        </p>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Signin;
