import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './home.css';
import axios from "axios";
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import HRConclaveGrid from '../../HomeScreen/HRConclaveGrid';

const expertiseAreas = [
  {
    title: "Networking Opportunities",
    image: "https://th.bing.com/th/id/OIP.3qaXOzEiqNAhIZWc3LpleAHaE8?w=252&h=180&c=7&r=0&o=5&dpr=1.2&pid=1.7",
    alt: "Conference Event",
  },
  {
    title: "Professional Development",
    image: "https://th.bing.com/th?id=OIP.Hupg0HJHR_18oATetZwIDAHaE8&w=306&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.2&pid=3.1&rm=2",
    alt: "Bespoke Event",
  },
  {
    title: "Exclusive Events",
    image: "https://th.bing.com/th/id/OIP.ucziH6SkmTjshyKZt8j88wHaE7?w=1430&h=953&rs=1&pid=ImgDetMain",
    alt: "Digital Event",
  },
  {
    title: "Networking Opportunities",
    image: "https://th.bing.com/th/id/OIP.3qaXOzEiqNAhIZWc3LpleAHaE8?w=252&h=180&c=7&r=0&o=5&dpr=1.2&pid=1.7",
    alt: "Conference Event",
  },
  {
    title: "Professional Development",
    image: "https://th.bing.com/th?id=OIP.Hupg0HJHR_18oATetZwIDAHaE8&w=306&h=204&c=8&rs=1&qlt=90&o=6&dpr=1.2&pid=3.1&rm=2",
    alt: "Bespoke Event",
  },
  {
    title: "Exclusive Events",
    image: "https://th.bing.com/th/id/OIP.ucziH6SkmTjshyKZt8j88wHaE7?w=1430&h=953&rs=1&pid=ImgDetMain",
    alt: "Digital Event",
  },
];

const testimonials = [
  {
    name: "Pawan Chandra",
    position: "Pidilite Industries",
    feedback: "Very well organised. Time management is brilliant. Time spent well.",
    rating: 5,
    image: "https://via.placeholder.com/60",
  },
  {
    name: "Ruhan Saldanha",
    position: "Kaizen",
    feedback: "We are delighted to have been a part of the 4th CFO-Confex & Awards 2024 – Mumbai Chapter. The event was a resounding success.",
    rating: 5,
    image: "https://via.placeholder.com/60",
  },
  {
    name: "Mellacheruvu Kalyan Ram",
    position: "Focus Softnet",
    feedback: "I would like to extend my appreciation to Mr. Naved of Gainskills Media for coordinating the recently concluded CX.",
    rating: 5,
    image: "https://via.placeholder.com/60",
  },
  {
    name: "John Doe",
    position: "Company X",
    feedback: "An amazing experience, well organized and insightful discussions.",
    rating: 4,
    image: "https://via.placeholder.com/60",
  },
  {
    name: "Jane Smith",
    position: "Company Y",
    feedback: "A well-coordinated event with fantastic networking opportunities.",
    rating: 5,
    image: "https://via.placeholder.com/60",
  },
];

function Home() {
  const [mongoEvents, setMongoEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/eventdetails`);
        setMongoEvents(response.data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const [startIndex, setStartIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);

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

  const nextTestimonial = () => {
    setStartIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setStartIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
const [popupData, setPopupData] = useState(null);

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
        <div
          key={index}
          className="expertise-card"
          onClick={() => openPopup(area)}
        >
          <img src={area.image} alt={area.alt} className="expertise-image" />
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
        <img src={popupData.image} alt={popupData.alt} />
        <h3>{popupData.title}</h3>
        <p>{popupData.alt}</p>
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
            <button className="arrow-button" onClick={prevTestimonial}>←</button>
            <div className="testimonial-cards">
              {testimonials.slice(startIndex, startIndex + itemsToShow).map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <div className="profile-section">
                    <img src={testimonial.image} alt={testimonial.name} className="profile-image" />
                    <div className="profile-info">
                      <h3>{testimonial.name}</h3>
                      <p>{testimonial.position}</p>
                    </div>
                  </div>
                  <div className="rating">{"⭐".repeat(testimonial.rating)}</div>
                  <p className="feedback">{testimonial.feedback}</p>
                </div>
              ))}
            </div>
            <button className="arrow-button" onClick={nextTestimonial}>→</button>
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
