import React, { useState, useContext } from 'react';
import './navbar.css';
import logo from '../../assets/logo.png';
import search_icon from '../../assets/search_icon.png';
import basket_icon from '../../assets/basket_icon.png';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/storecontext';
import { assets } from '../../assets/assets';

const Navbar = ({ setshowlogin }) => {
  const [menu, setmenu] = useState('home');
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    setToken("");
    navigate('/')
  }

  return (
    <div className='navbar'>
      <Link to='/'>
        <img src={logo} alt="" className='logo' />
      </Link>

      <ul className='navbar-menu'>
        <a href='/#home' onClick={() => setmenu('home')} className={menu === 'home' ? 'active' : ''}>Home</a>
        <a href='/#menu' onClick={() => setmenu('menu')} className={menu === 'menu' ? 'active' : ''}>Menu</a>
        <a href='/#mobile' onClick={() => setmenu('mobile')} className={menu === 'mobile' ? 'active' : ''}>Mobile App</a>
        <a href='/#contact' onClick={() => setmenu('contact')} className={menu === 'contact' ? 'active' : ''}>Contact Us</a>
      </ul>

      <div className="navbar-right">
        <img src={search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to='/cart'>
            <img src={basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token
          ? <button onClick={() => setshowlogin(true)}>Sign in</button>
          : <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate('/myorders')} > <img src={assets.bag_icon} alt="" /> <p> Orders </p> </li>
              <hr />
              <li onClick={logout} > <img src={assets.logout_icon} alt="" /> <p> Logout </p> </li>
            </ul>
          </div>
        }
      </div>
    </div>
  );
};

export default Navbar;
