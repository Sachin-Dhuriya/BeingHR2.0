import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashBoard.css';

const DashBoard = () => {
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [adminLoading, setAdminLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('http://localhost:5000/check-admin', { credentials: 'include' });

        if (res.status === 401) {
          // Not logged in
          navigate('/login');
          return;
        }

        const data = await res.json();
        if (!data.isAdmin) {
          // Logged in but not admin
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
            <tr key={user._id || index}>
              <td>{index + 1}</td>
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
