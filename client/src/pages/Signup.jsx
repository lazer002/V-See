// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';

// function Signup() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState({
//     email: '', password: '', username: ''
//   });

//   const handleInp = (e) => {
//     const { name, value } = e.target;
//     setUser({ ...user, [name]: value });
//   };

//   const subData = async (e) => {
//     e.preventDefault();
//     try {
//       const data = await axios.post('http://localhost:9999/signup', user);
//       localStorage.setItem('token', data.data.token);
//       navigate('/signin');
//     } catch (error) {
//       console.error("Error during sign up:", error);
//     }
//   };

//   const googleAuth = () => {
//     window.location.href = 'http://localhost:9999/auth/google/';
//   };

//   return (
//     <>
//       <h4>User SignUp</h4>
//       <input type='email' name="email" id="email" value={user.email} onChange={handleInp} />
//       <input type="password" name="password" id="password" value={user.password} onChange={handleInp} />
//       <input type="text" name="username" min={6} max={12} id="username" value={user.username} onChange={handleInp} />
//       <button type="submit" onClick={subData}>Submit</button>
//       {/* <p onClick={googleAuth} style={{ cursor: 'pointer',border:'1px solid black',width:'fit-content',padding:'4px' }}>Sign Up with Google</p> */}
//       <p>I already have an account <Link to="/signin">Sign In</Link></p>
//     </>
//   );
// }

// export default Signup;



import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { RiGoogleFill } from 'react-icons/ri';

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
      const response = await axios.post('http://localhost:9999/signup', user);
      localStorage.setItem('token', response.data.token);
      navigate('/signin');
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  const googleAuth = () => {
    window.location.href = 'http://localhost:9999/auth/google/';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-400">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg transform transition-transform hover:scale-105">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Your Account</h2>
        <form onSubmit={subData} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type='email'
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
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={user.username}
              onChange={handleInp}
              placeholder="Choose a username"
              minLength={6}
              maxLength={12}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-transform hover:bg-gray-50"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">Sign In</Link>
        </p>
        <div className="mt-6 flex flex-col items-center">
          <button
            onClick={googleAuth}
            className="w-full flex items-center justify-center bg-gray-200 text-gray-800 py-2 px-4 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <RiGoogleFill className="w-5 h-5 mr-2" />
            Sign Up with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;

//////////////