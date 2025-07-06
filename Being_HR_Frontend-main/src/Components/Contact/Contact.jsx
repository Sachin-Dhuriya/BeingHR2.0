import React, { useState, useEffect } from "react";
import "./Contact.css"; 
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaYoutube, FaUsers, FaCalendarAlt, FaHandshake, FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";

const Contact = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // State for success or error messages
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/auth-status`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(data.isAuthenticated))
      .catch(() => setIsLoggedIn(false));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setError("You must be logged in to submit the form.");
      return;
    }

    setError("");
    setResponseMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact/form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage("Form submitted successfully!");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setError(data.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      setError("Failed to submit the form. Server might be down.");
    }
  };

  return (



      <div className="cnt-container">
      <div className="cnt-header">
        <h1>Contact BeingHR</h1>
        <p>Whether you have questions, feedback, or partnership inquiries, we’ do love to hear from you!</p>
      </div>

      <div className="cnt-grid">
        <div className="cnt-card">
          <h2>General Inquiries</h2>
          <p><FaEnvelope /> shyam@beinghr.online</p>
          <p><FaPhone /> +91 88504 87716</p>
          <p><FaMapMarkerAlt /> 103, Shourie Complex, JP Rd, Andheri West, Mumbai 400058</p>
        </div>

        <section className="contact-page-sections">
            <h2 className="page-section-title">Contact Form</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
               
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="form-group">
              
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
             
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="form-group">
                
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message"
                  required
                ></textarea>
              </div>
              <button type="submit" className="submitctn-button">
                Submit
              </button>
            </form>

            {/* Display response message */}
            {responseMessage && <p className="success-message">{responseMessage}</p>}
            {error && <p className="error-message">{error}</p>}
          </section>
      </div>

      <div className="cnt-grid">
        <div className="cnt-card">
          <h2><FaGlobe /> Join the Community</h2>
          <p>Visit: <a href="https://www.beinghr.online">www.beinghr.online</a></p>
          <p>Membership: <a href="mailto:membership@beinghr.com">membership@beinghr.com</a></p>
        </div>
        <div className="cnt-card">
          <h2><FaCalendarAlt /> Event Information</h2>
          <p>For event details: <a href="mailto:events@beinghr.com">events@beinghr.com</a></p>
        </div>
        <div className="cnt-card">
          <h2><FaHandshake /> Partnership Opportunities</h2>
          <p>Collaborate with us: <a href="mailto:partners@beinghr.com">partners@beinghr.com</a></p>
        </div>
      </div>

      <div className="cnt-social">
        <h2>Follow Us</h2>
        <div className="cnt-social-links">
           <a href="https://www.linkedin.com/company/beinghr/" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin size={30} />
                  </a>
                  <a href="https://x.com/i_beinghr" target="_blank" rel="noopener noreferrer">
                    <FaTwitter size={30} />
                  </a>
                  <a href="https://www.instagram.com/i_beinghr/" target="_blank" rel="noopener noreferrer">
                    <FaInstagram size={30} />
                  </a>
                  <a href="https://www.youtube.com/@BeingHRpro" target="_blank" rel="noopener noreferrer">
                    <FaYoutube size={30} />
                  </a>
        </div>
      </div>
    </div>
 
  );
};

export default Contact;
