import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import axios from "axios"; // Import axios for API requests
import "./Event.css";

function Events() {
  const [mongoEvents, setMongoEvents] = useState([]); // State to store events from MongoDB

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/eventdetails`);
        console.log("Fetched Events Data:", response.data.data); // Debugging
        setMongoEvents(response.data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="events-container">
      <header className="events-header">
        <h1>Events - BeingHR Community</h1>
        <p>
          BeingHR hosts a variety of impactful and engaging events designed to
          bring HR professionals together, foster collaboration, and address the
          evolving challenges in human resources.
        </p>
      </header>

      <div className="events-list">
        {mongoEvents.map((event, index) => (
          <div className="events-card" key={`mongo-${index}`}>
            <img
              src={event.image || "https://via.placeholder.com/400"}
              alt={event.title}
              className="event-image"
            />
            <div className="event-content">
              <h2 className="event-category">{event.title}</h2>
              <div className="event-upcoming">
                <p>
                  <strong>Date:</strong> {event.date}
                </p>
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
                <p>
                  <strong>Time:</strong> {event.time}
                </p>

                {/* Dynamic Link to Event Details */}
                <Link to={`/eventdetails/${event._id}`} className="cta-button">
                  Book
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;
