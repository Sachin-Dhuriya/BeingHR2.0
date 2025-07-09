import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-bottom-container">
        <div className="footer-logo-left">
          <img src="/logo trasperent.png" alt="Being HR Logo" className="footer-logo-img" />
          <p className="footer-logo-text">Being HR</p>
        </div>
        <div className="footer-bottom-text">
          <p>Privacy Policy | Refund and Terms & Conditions</p>
          <p>© Copyright GM Infotech Pvt Ltd - 2025</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
