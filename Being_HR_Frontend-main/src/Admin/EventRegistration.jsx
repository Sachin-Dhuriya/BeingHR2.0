import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashBoard.css';

const DashBoard = () => {
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [adminLoading, setAdminLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState('All'); // default to 'All'
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('http://localhost:5000/check-admin', { credentials: 'include' });

        if (res.status === 401) {
          navigate('/login');
          return;
        }

        const data = await res.json();
        if (!data.isAdmin) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin:', error);
        navigate('/');
      } finally {
        setAdminLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  useEffect(() => {
    if (!adminLoading) {
      const fetchEventRegistrations = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/eventregistration`, { credentials: 'include' });
          const data = await response.json();
          setEventRegistrations(data);
        } catch (error) {
          console.error('Error fetching event registrations:', error);
        }
      };

      fetchEventRegistrations();
    }
  }, [adminLoading]);

  if (adminLoading) {
    return <div>Loading...</div>;
  }

  // Get unique event names from registrations
  const uniqueEvents = Array.from(new Set(eventRegistrations.map(reg => reg.eventName)));

  // Filtered registrations based on selected event
  const filteredRegistrations = selectedEvent === 'All'
    ? eventRegistrations
    : eventRegistrations.filter(reg => reg.eventName === selectedEvent);

  return (
    <div className="admin-page">
      <h1>Registration List</h1>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={selectedEvent === 'All' ? 'active' : ''}
          onClick={() => setSelectedEvent('All')}
        >
          All Events
        </button>
        {uniqueEvents.map(eventName => (
          <button
            key={eventName}
            className={selectedEvent === eventName ? 'active' : ''}
            onClick={() => setSelectedEvent(eventName)}
          >
            {eventName}
          </button>
        ))}
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Name</th>
            <th>Personal Email</th>
            <th>Official Email</th>
            <th>Phone</th>
            <th>Designation</th>
            <th>Organisation</th>
            <th>Location</th>
            <th>Event Name</th>
            <th>Registered At</th>
          </tr>
        </thead>
        <tbody>
          {filteredRegistrations.map((user, index) => (
            <tr key={user._id || index}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.officialEmail}</td>
              <td>{user.phone}</td>
              <td>{user.designation}</td>
              <td>{user.organisation}</td>
              <td>{user.location}</td>
              <td>{user.eventName}</td>
              <td>{new Date(user.registeredAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashBoard;
