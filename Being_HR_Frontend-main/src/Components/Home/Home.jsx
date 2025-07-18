import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './home.css';
import axios from "axios";
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import HRConclaveGrid from '../../HomeScreen/HRConclaveGrid';

function Home() {
  const [mongoEvents, setMongoEvents] = useState([]);
  const [expertiseAreas, setExpertiseAreas] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [voiceCards, setVoiceCards] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/eventdetails`);
        setMongoEvents(response.data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const fetchExpertise = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/cards`);
        setExpertiseAreas(response.data);
      } catch (error) {
        console.error("Error fetching expertise areas:", error);
      }
    };

    const fetchVoiceCards = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/voicecard`);
        setVoiceCards(res.data);
      } catch (error) {
        console.error("Error fetching voice cards:", error);
      }
    };

    fetchEvents();
    fetchExpertise();
    fetchVoiceCards();
  }, []);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth <= 768) {
        setItemsToShow(1);
      } else {
        setItemsToShow(3);
      }
    };

    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % voiceCards.length);
    }, 3000); // slide every 4 seconds

    return () => clearInterval(interval);
  }, [voiceCards.length]);

  const openPopup = (data) => {
    setPopupData(data);
  };

  const closePopup = () => {
    setPopupData(null);
  };

  const scrollExpertise = (direction) => {
    const carousel = document.getElementById("expertise-carousel");
    const scrollAmount = 350;
    if (direction === "left") {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="app">
      {/* Hero Section */}
      <motion.div className="hero-section" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <motion.div className="hero-content" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.5 }}>
          <h1 className="hero-title">Empowering HR Professionals Across India</h1>
          <p className="hero-subtitle">Join the largest community of HR professionals.</p>
          <div className="hero-buttons">
            <Link to="/signup" className="hero-button primary">Join the Community</Link>
            <Link to="/event" className="hero-button secondary">Explore Our Events</Link>
          </div>
        </motion.div>
      </motion.div>

      {/* HR Conclave Section */}
      <HRConclaveGrid />

      {/* Expertise Section */}
      <motion.div className="expertise-section" initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <h2 className="expertise-title">We Are Experts In</h2>

        <div className="expertise-carousel-wrapper">
          <button className="scroll-btn left" onClick={() => scrollExpertise('left')}>←</button>
          <div className="expertise-carousel" id="expertise-carousel">
            {expertiseAreas.map((area, index) => (
              <div key={index} className="expertise-card" onClick={() => openPopup(area)}>
                <img src={area.image} alt={area.title} className="expertise-image" />
                <div className="expertise-content">
                  <h3 className="expertise-card-title">{area.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <button className="scroll-btn right" onClick={() => scrollExpertise('right')}>→</button>
        </div>

        {popupData && (
          <div className="popup-overlay" onClick={closePopup}>
            <div className="popup-card" onClick={(e) => e.stopPropagation()}>
              <img src={popupData.image} alt={popupData.title} />
              <h3>{popupData.title}</h3>
              <p>{popupData.content}</p>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Upcoming Events Section */}
      <motion.div className="home-events-list" initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <h1>Our Upcoming Events</h1>
        <h3>Engage with Experts, Expand Your Horizons</h3>
        <div className="upcoming-events">
          {mongoEvents.map((event, index) => (
            <div className="home-event-card" key={`mongo-${index}`}>
              <img src={event.image || "https://via.placeholder.com/400"} alt={event.title} className="event-image" />
              <div className="home-event-details">
                <h2>{event.title}</h2>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Time:</strong> {event.time}</p>
              </div>
              <Link to={`/eventdetails/${event._id}`} className="cta-button-h">Book</Link>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div className="two" initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <div className="testimonials-container">
          <h2 className="testimonials-title">Voices from Our Community</h2>
          <div className="testimonials-wrapper">
            <motion.div
              key={startIndex} // triggers animation
              className="testimonial-cards"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {(() => {
                const visibleTestimonials = [];
                for (let i = 0; i < itemsToShow; i++) {
                  const index = (startIndex + i) % voiceCards.length;
                  visibleTestimonials.push(voiceCards[index]);
                }
                return visibleTestimonials
                  .filter(testimonial => testimonial && testimonial.image)
                  .map((testimonial, index) => (
                    <div key={index} className="testimonial-card">
                      <div className="profile-section">
                        <img src={testimonial.image} alt={testimonial.name || "Profile"} className="profile-image" />
                        <div className="profile-info">
                          <h3>{testimonial.name || "Anonymous"}</h3>
                          <p>{testimonial.designation || "Member"} | {testimonial.companyName || ""}</p>
                        </div>
                      </div>
                      <p className="feedback">{testimonial.content || ""}</p>
                    </div>
                  ));

              })()}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div className="contact-section-home" initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <h2>Have Questions? Let’s Connect!</h2>
        <div className="home-contact-info">
          <p>Email: <a href="mailto:shyam@beinghr.online">shyam@beinghr.online</a></p>
          <p>Phone: <a href="tel:+918850487716">+91 88504 87716</a></p>
        </div>
        <div className="home-social-icons">
          <a href="https://www.linkedin.com/company/beinghr/" target="_blank" rel="noopener noreferrer"><FaLinkedin size={30} /></a>
          <a href="https://x.com/i_beinghr" target="_blank" rel="noopener noreferrer"><FaTwitter size={30} /></a>
          <a href="https://www.instagram.com/i_beinghr/" target="_blank" rel="noopener noreferrer"><FaInstagram size={30} /></a>
          <a href="https://www.youtube.com/@BeingHRpro" target="_blank" rel="noopener noreferrer"><FaYoutube size={30} /></a>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
