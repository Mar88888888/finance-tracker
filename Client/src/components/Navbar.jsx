import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, setUser, setAuthToken } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    setAuthToken(null);
    navigate('/login');
  };


  return (
    <nav className="navbar">
      <h2>Finance Tracker</h2>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/groups">Groups</Link>
            <Link to="/transactions">Transactions</Link>
            <Link to="/purposes">Purposes</Link>
            <span
              className="navbar-username"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <strong>{user.name}</strong>
            </span>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/login">Log In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;