import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Forgot from './pages/Forgot'; 
import { AuthContext } from './AuthContext';

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/signin" />} />
      <Route path="/signin" element={isLoggedIn ? <Navigate to="/" /> : <Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/user/:username/:id" element={isLoggedIn ? <Profile /> : <Navigate to="/signin" />} />
      <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/signin" />} />

      <Route path="/forgotpassword" element={<Forgot />} /> 
    </Routes>
  );
}

export default App;
