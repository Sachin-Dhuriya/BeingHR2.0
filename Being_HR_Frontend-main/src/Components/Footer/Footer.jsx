import React from 'react';
import './Footer.css'; // Import the CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo and Description */}
        <div className="footer-section">
          <div className="logo-container">
          <img src="/logo trasperent.png" alt="Logo" className="logo-img" />
            <span className="logo-text">Being HR</span>
          </div>
          <p className="description">
          BeingHR is India’s leading community for HR professionals, offering unmatched opportunities to connect, learn, and grow. With over 60,000 members from industries like IT, Media, Manufacturing, and Startups, we are redefining HR's role as a strategic partner in business success.
          </p>
          <div className="social-icons">
            <a href="#" className="icon">LinkedIn</a>
            <a href="#" className="icon">Instagram</a>
            <a href="#" className="icon">Facebook</a>
            <a href="#" className="icon">YouTube</a>
          </div>
        </div>

        {/* Events Links */}
        

        {/* Links */}
        <div className="footer-section">
          <h3 className="footer-title">LINKS</h3>
          <ul className="footer-list">
            <li><a href="#">Home</a></li>
            <li><a href="#">Sponsorship</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Career</a></li>
            <li><a href="#">Gallery</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3 className="footer-title">HAVE A QUESTIONS?</h3>
          <p>Office Address: 103, Shourie Complex, JP Rd, Andheri West, Mumbai 400058</p>
          <p><a href="tel:+919082419495">+91 88504 87716</a></p>
          <p><a href="mailto:shyam@beinghr.online">shyam@beinghr.online</a></p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>Privacy Policy | Refund and Terms & Conditions</p>
        <p>© Copyright GM Infitech Pvt Ltd - 2025</p>
      </div>
    </footer>
  );
};

export default Footer;
