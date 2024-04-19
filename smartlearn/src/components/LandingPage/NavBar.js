import React, { useState, useEffect, useContext,useRef } from 'react';
import './NavBar.css'; // Import the CSS file for styling
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';

import { CartContext } from '../../context/CartContext';

const NavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { cartItemCount, fetchCartItemCount } = useContext(CartContext);


  const dropdownRef = useRef(null);
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const token = localStorage.getItem('token');
  const authenticated = token !== null;
  console.log(token);
  console.log(authenticated);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log(token);
    console.log(authenticated);
  };

  let userName = '';
  let role = '';
  if (authenticated) {
    const decodedToken = jwt_decode(token);
    userName = decodedToken.name;
    if (decodedToken.isAdmin) {
      role = 'Admin';
    } else {
      role = 'Client';
    }
  }

  const handleClick = () => {
    if (authenticated) {
      const decodedToken = jwt_decode(token);
      userName = decodedToken.name;

      if (decodedToken.isAdmin) {
        navigate('/AdminDashboard');
      } else {
        navigate('/dashboard/user');
      }
    }
  };

  const [websiteData, setWebsiteData] = useState({});
  useEffect(() => {
    fetchWebsiteData();
  }, []);

  const fetchWebsiteData = () => {
    fetch('http://localhost:3001/website')
      .then((response) => response.json())
      .then((data) => {
        setWebsiteData(data);
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching website data:', error);
      });
  };
  // url home? -<> home
  const [selectedMenuItem, setSelectedMenuItem] = useState('home');

  const handleSelected = (menu) => {
    setSelectedMenuItem(menu);

  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={websiteData.logo} alt="Logo" />
        </Link>
      </div>
      <ul className="navbar-menu">
  <li className={selectedMenuItem === 'home' ? 'selected' : ''}>
    <Link to="/" onClick={() => handleSelected('home')}>Home</Link>
  </li>
  <li className={selectedMenuItem === 'courses' ? 'selected' : ''}>
    <Link to="courses" onClick={() => handleSelected('courses')}>Courses</Link>
  </li>
  <li className={selectedMenuItem === 'artist' ? 'selected' : ''}>
    <Link to="artist" onClick={() => handleSelected('artist')}>Artist</Link>
  </li>
  <li className={selectedMenuItem === 'contact' ? 'selected' : ''}>
    <Link to="contact" onClick={() => handleSelected('contact')}>Contact</Link>
  </li>
  <li className={selectedMenuItem === 'aboutUs' ? 'selected' : ''}>
    <Link to="aboutUs" onClick={() => handleSelected('aboutUs')}>About us</Link>
  </li>
</ul>


      <div className="navbar-buttons">
        <Link to="cart">
          <ShoppingCartOutlinedIcon />
          {cartItemCount}
        </Link>

        {!authenticated && (
          <>
            <Link to="Login">
              <button className="Login">Login</button>
            </Link>
            <Link to="SignUp">
              <button className="SignUp">Sign up</button>
            </Link>
          </>
        )}

{authenticated && (
  <div className="dropdown"  ref={dropdownRef}>
    <button className="login-dropdown" onClick={toggleDropdown}>
      <AccountCircleOutlinedIcon />
      {userName}
    </button>

    {showDropdown && (
      <div className="dropdown-content" >
        <table>
          <tbody>
            <tr onClick={handleClick}>
              <td><DashboardIcon /></td>
              <td>{role} Dashboard</td>
            </tr>
            <tr>
              <td><Link to="/" onClick={handleLogout}><LogoutIcon /></Link></td>
              <td><Link to="/" onClick={handleLogout}>Logout</Link></td>
            </tr>
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

      </div>
    </nav>
  );
};

export default NavBar;
