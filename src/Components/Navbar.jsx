import React from 'react'
import logo from '../assets/logo.png'
import "./Navbar.css"
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className='MainDiv'>
        <div >
            <img src={logo} alt="Logo" className='logo'/>
        </div>
        <div className='navItems'>
          <div className='item'>
            <Link to="/">Dashboard</Link>
          </div>
          <div className='item'>
            <Link className="item" to="/profile">Profile</Link>
          </div>          
          <div className='item'>
            <Link  to="/history">History</Link>
          </div>
          <div className='item'>
            <Link className="item" to="/calculator">Calculator</Link>
          </div>
        </div>
      
    </div>
  )
}

export default Navbar
