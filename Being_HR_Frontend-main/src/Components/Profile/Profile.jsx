import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [registeredEvents, setRegisteredEvents] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user`, {
          withCredentials: true,
        });

        console.log("Response from /user:", res.data);

        if (res.data && Array.isArray(res.data.registeredEvents)) {
          const eventDetails = await Promise.all(
            res.data.registeredEvents.map(async (eventId) => {
              try {
                const eventRes = await axios.get(
                  `${import.meta.env.VITE_API_BASE_URL}/eventdetails/${eventId}`
                );
                console.log("Event fetched:", eventRes.data);
                return eventRes.data;
              } catch (err) {
                console.error("Error fetching event details:", err);
                return { _id: eventId, title: "Event Name Not Available" };
              }
            })
          );

          setRegisteredEvents(eventDetails);
        } else {
          console.warn("No registeredEvents found in user data.");
          setRegisteredEvents([]); // explicitly clear to show no events
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchEvents();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="user-profile-container">
      <h1 className="user-profile-title">My Profile</h1>
      <img src={user.image} alt="Profile" className="user-profile-pic" />
      <h2 className="user-profile-name">{user.name}</h2>
      <p className="user-profile-email">Email: {user.email}</p>

      <h3 className="user-profile-events-title">Registered Events</h3>
      <ul className="user-profile-events-list">
        {registeredEvents.length > 0 ? (
          registeredEvents.map((event) => (
            <li key={event._id} className="user-profile-event-item">
              <Link to={`/eventdetails/${event._id}`} className="event-link">
                {event.title || "Event Name Not Available"}
              </Link>
            </li>
          ))
        ) : (
          <p className="user-profile-no-events">
            You have not registered for any events.
          </p>
        )}
      </ul>

      <button onClick={logout} className="user-profile-logout-button">
        Logout
      </button>
    </div>
  );
};

export default Profile;
