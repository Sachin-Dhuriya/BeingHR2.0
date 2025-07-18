import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EventRegistration.css';

const EventCards = () => {
  const [events, setEvents] = useState([]);
  const [openTables, setOpenTables] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/allevent`);
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const toggleTable = (eventId) => {
    setOpenTables((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((event) => (
        <div key={event._id} className="border rounded-xl shadow p-4">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-48 object-cover rounded mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
          <p className="text-gray-600 mb-1">📅 {event.date} | 🕒 {event.time}</p>
          <p className="text-gray-600 mb-1">📍 {event.location}</p>
          <p className="text-gray-600 mb-1">💲 {event.price}</p>

          <div className="flex flex-wrap mt-3 gap-2">
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
              onClick={() => toggleTable(event._id)}
            >
              {openTables[event._id] ? 'Hide Booking' : 'View Booking'}
            </button>
          </div>

          {/* Registration Table */}
          {openTables[event._id] && (
            <div className="overflow-auto mt-4">
              {event.registrations.length > 0 ? (
                <table className="min-w-full text-sm text-left border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Designation</th>
                      <th className="p-2 border">Organisation</th>
                      <th className="p-2 border">Email</th>
                      <th className="p-2 border">Official Email</th>
                      <th className="p-2 border">Phone</th>
                      <th className="p-2 border">Location</th>
                      <th className="p-2 border">Registered At</th>
                      <th className="p-2 border">Linkedin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.registrations.map((user) => (
                      <tr key={user._id}>
                        <td className="p-2 border">{user.name}</td>
                        <td className="p-2 border">{user.designation}</td>
                        <td className="p-2 border">{user.organisation}</td>
                        <td className="p-2 border">{user.email}</td>
                        <td className="p-2 border">{user.officialEmail}</td>
                        <td className="p-2 border">{user.phone}</td>
                        <td className="p-2 border">{user.location}</td>
                        <td className="p-2 border">{new Date(user.registeredAt).toLocaleString()}</td>
                        <td className="p-2 border">
                          <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No bookings found for this event.</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventCards;
