import React, { useState, useEffect } from "react";
import { MapPin, Clock, ThumbsUp } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EventDetails.css";
import { useAuth } from "../AuthContext"; // Import authentication context

const EventCard = () => {
  const { id } = useParams(); // Get event ID from URL
  const [event, setEvent] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user authentication status

  useEffect(() => {
    console.log("Event ID from URL:", id); // Check if ID is received

    if (!id) {
      console.log("Event ID is missing!");
      return;
    }

    const fetchEvent = async () => {
      try {
        console.log("Attempting to fetch event details...");
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/eventdetails/${id}`);
        console.log("Fetched event data:", response.data); // Check fetched data
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBooking = () => {
    if (!user) {
      alert("Please log in first to book this event.");
      navigate("/login");
    } else {
      navigate(`/booking/${event._id}`);
    }
  };

  if (!event) {
    return <p>Loading...</p>;
  }

  // ✅ New: Combine event.date and event.time to check if expired
  const eventDateTime = new Date(`${event.date} ${event.time}`);
  const isExpired = eventDateTime < new Date();

  return (
    <div>
      {/* Event Banner Image */}
      <div className="event-banner-container">
        <img src={event.image} alt={event.title} className="event-banner" />
      </div>

      {/* Main Event Card */}
      <div className="event-card">
        <div className="event-header">
          <div>
            <h2 className="event-title">{event.title}</h2>
            <p className="event-details">
              {event.eventctg} | {event.language} | {event.agelimit}+ | {event.duration} Minutes
            </p>
          </div>
          {isExpired ? (
            <button className="expired-button" disabled>Expired</button>
          ) : (
            <button className="book-button" onClick={handleBooking}>Book</button>
          )}
        </div>

        <hr className="divider" />

        <div className="event-info">
          <div className="event-time">
            <Clock className="icon" />
            <span>{event.date} at {event.time}</span>
          </div>
          <div className="event-location">
            <MapPin className="icon" />
            <span>{event.location}</span>
          </div>
          <p className="event-price">
            ₹ {event.price} <span className="price-small">onwards</span>
          </p>
        </div>
      </div>

      {/* Share & Interest Section */}
      <div className="share-interest-container">
        {/* Share Box */}
        <div className="share-box">
          <h3>Share this event</h3>
          <div className="social-icons">
            <div className="social-icon">
              <Link to="https://x.com/i_beinghr">
                <img src="https://img.icons8.com/ios11/512/facebook-new.png" alt="Facebook" />
              </Link>
            </div>
            <div className="social-icon">
              <Link to="https://x.com/i_beinghr">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733635.png" alt="Twitter" />
              </Link>
            </div>
          </div>
        </div>

        {/* Interest Box */}
        <div className="interest-box">
          <h3>Click on Interested to stay updated about this event.</h3>
          <div className="interest-container">
            <div className="interest-info">
              <ThumbsUp className="thumbs-up" />
              <span>11</span>
            </div>
            <p className="Content-interested-Section">People have shown interest recently</p>
            <button className="interested-button">Interested?</button>
          </div>
        </div>

        {/* Event Description */}
        <div className="events-aboutus-container">
          <p className="event-description" dangerouslySetInnerHTML={{ __html: event.description }} />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
