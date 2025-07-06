import React, { useState, useEffect } from 'react';
import './DashBoard.css';

const DashBoard = () => {
  // State to store event registration data
  const [eventRegistrations, setEventRegistrations] = useState([]);

  // Fetch event registrations from the backend
  useEffect(() => {
    const fetchEventRegistrations = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/eventregistration`);
        const data = await response.json();
        setEventRegistrations(data);
      } catch (error) {
        console.error('Error fetching event registrations:', error);
      }
    };
    
    fetchEventRegistrations();
  }, []);

  return (
    <div className="admin-page">
      <h1>Registration List</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Age</th>
            <th>Event Name</th>
          </tr>
        </thead>
        <tbody>
          {eventRegistrations.map((user, index) => (
            <tr key={user._id || index}> {/* Using _id or index as key */}
              <td>{index + 1}</td> {/* Display index as ID */}
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.age}</td>
              <td>{user.eventName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashBoard;
