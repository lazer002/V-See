import React from 'react'
import { Link } from 'react-router-dom';

function Header() {
  return (
    <>
    <div style={{display:'flex',justifyContent:'space-between'}}>
        

    <Link to="/">Home</Link>
    <Link to="/product">Product</Link>
    <Link to="/dashboard">Dashboard</Link>
        
        
        </div>  




    </>
  )
}

export default Header
