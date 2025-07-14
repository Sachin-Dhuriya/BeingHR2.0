import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashBoard.css';

const DashBoard = () => {
  const [userQueries, setUserQueries] = useState([]);
  const [adminLoading, setAdminLoading] = useState(true);
  const navigate = useNavigate();

  // Check admin status on mount
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('http://localhost:5000/check-admin', { credentials: 'include' });
        const data = await res.json();
        if (!data.isAdmin) {
          navigate('/'); // redirect if not admin
        }
      } catch (error) {
        console.error('Error checking admin:', error);
        navigate('/'); // redirect on error
      } finally {
        setAdminLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  // Fetch user queries once admin check passes
  useEffect(() => {
    if (!adminLoading) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact/form`)
        .then(response => response.json())
        .then(data => setUserQueries(data))
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [adminLoading]);

  if (adminLoading) {
    return <div>Loading...</div>; // loading indicator while checking admin
  }

  return (
    <div className="admin-page">
      <h1>User Query</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {userQueries.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashBoard;
