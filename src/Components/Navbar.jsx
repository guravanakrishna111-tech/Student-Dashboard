import React from 'react'
import logo from '../assets/logo.png'
import "./Navbar.css"
import { Link } from "react-router-dom";
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseconfig';

const Navbar = ({ user }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className='MainDiv'>
        <div>
            <img src={logo} alt="Logo" className='logo'/>
        </div>
        <div className='navItems'>
          <div className='item'>
            <Link to="/">📊 Dashboard</Link>
          </div>
          <div className='item'>
            <Link to="/tasks">📝 Tasks</Link>
          </div>
          <div className='item'>
            <Link to="/analytics">📈 Analytics</Link>
          </div>
          <div className='item'>
            <Link to="/history">📚 History</Link>
          </div>
          <div className='item'>
            <Link to="/profile">👤 Profile</Link>
          </div>
          <div className='item'>
            <Link to="/calculator">🧮 Calculator</Link>
          </div>
          <div className='item'>
            <Link to="/settings">⚙️ Settings</Link>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user ? (
            <>
              <span style={{ fontSize: '14px' }}>👤 {user.email || 'User'}</span>
              <button 
                onClick={handleLogout}
                style={{
                  padding: '5px 15px',
                  backgroundColor: '#EF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: '14px', color: '#667eea', textDecoration: 'none' }}>Sign In</Link>
            </>
          )}
        </div>
      
    </div>
  )
}

export default Navbar
