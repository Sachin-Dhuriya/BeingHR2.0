import React, { useState, useEffect } from 'react';
import './DashBoard.css';

const DashBoard = () => {
  // State to hold the user queries fetched from the backend
  const [userQueries, setUserQueries] = useState([]);

  // Fetch user queries from the backend when the component mounts
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contact/form`) // Update the URL if needed
      .then(response => response.json())
      .then(data => setUserQueries(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []); // Empty array ensures the effect runs only once when the component mounts

  return (
    <div className="admin-page">
      <h1>User Query</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>Sr No</th> {/* Column name changed to Sr No */}
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {userQueries.map((user, index) => (
            <tr key={user._id}> {/* Use _id as the unique key */}
              <td>{index + 1}</td> {/* Sr No is the index + 1 */}
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
