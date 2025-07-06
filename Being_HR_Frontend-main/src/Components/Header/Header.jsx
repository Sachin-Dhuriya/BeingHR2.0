import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext"; 
import { motion, AnimatePresence } from "framer-motion";
import "./Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Add state for dropdown
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="navbar">
      <div className="company-logo">
        <img src="/logo trasperent.png" alt="Logo" className="logo-img" />
        <span className="logo-text">
          <span className="gs">Being HR</span>
        </span>
      </div>
      <nav className={`desktop-nav ${isMenuOpen ? "open" : ""}`}>
        <Link to="/">Home</Link>
        <Link to="/event">Events</Link>
        <Link to="/about">About Us</Link>
        <Link to='/blog'>Blog</Link>
        <Link to="/contact">Contact Us</Link>

        {user ? (
          <div className="profile-dropdown">
            <button className="profile-button" onClick={toggleDropdown}>
              <img src={user.image} alt="Profile" className="profile-img" />
              {user.name} ▼
            </button>
            {isDropdownOpen && (
              <div className="dropdown-content">
                <Link to="/profile">My Profile</Link>
                <button onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="join-now-button">Join Now</Link>
        )}
      </nav>
      <button className="menu-toggle" onClick={toggleMenu}>☰</button>
   
 {/* Animate Presence for smoother unmount */}
  <AnimatePresence>
    {isMenuOpen && (
      <>
        {/* Sliding Mobile Nav */}
        <motion.nav
          className="mobile-nav"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "tween", duration: 0.4 }}
        >
          <button className="close-btn" onClick={toggleMenu}>✖</button>
          <Link to="/" onClick={toggleMenu}>Home</Link>
          <Link to="/event" onClick={toggleMenu}>Events</Link>
          <Link to="/about" onClick={toggleMenu}>About Us</Link>
          <Link to="/blog" onClick={toggleMenu}>Blog</Link>
          <Link to="/contact" onClick={toggleMenu}>Contact Us</Link>
          {user ? (
          <div className="profile-dropdown">
            <button className="profile-button" onClick={toggleDropdown}>
              <img src={user.image} alt="Profile" className="profile-img" />
              {user.name} ▼
            </button>
            {isDropdownOpen && (
              <div className="dropdown-content">
                <Link to="/profile">My Profile</Link>
                <button onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="join-now-button">Login </Link>
        )}
        </motion.nav>

        {/* Overlay Background */}
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={toggleMenu}
        />
      </>
    )}
  </AnimatePresence>
  </header>
   );
}

export default Header;
