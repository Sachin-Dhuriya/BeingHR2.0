import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateEvents.css'; // keep your CSS, but see notes below
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const UpdateEvents = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [expandedEventId, setExpandedEventId] = useState(null);

  useEffect(() => {
    const textarea = document.querySelector('.description-textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [formData.description]);


  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      if (Array.isArray(res.data)) {
        setEvents(res.data);
      } else if (Array.isArray(res.data.events)) {
        setEvents(res.data.events);
      } else {
        console.error("Unexpected response format:", res.data);
        setEvents([]);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setEvents([]);
    }
  };

  const startEdit = (event) => {
    setEditingEvent(event);
    setFormData(event);
    setImageFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUpdate = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/events/${editingEvent._id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(res.data.message || "Event updated successfully");
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update event');
    }
  };

  const toggleExpand = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  return (
    <div className="update-events-page">
      <h2>🛠 Update Events</h2>

      <div className="event-list">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <img
              src={event.image || 'https://via.placeholder.com/300'}
              alt={event.title}
              className="event-image"
            />
            <div className="event-content">
              <h3>{event.title}</h3>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Time:</strong> {event.time}</p>

              <div className="buttons">
                <button onClick={() => toggleExpand(event._id)}>
                  {expandedEventId === event._id ? 'Hide' : 'View'}
                </button>
                <button onClick={() => startEdit(event)}>✏️ Edit</button>
              </div>

              {expandedEventId && (
                <div className="modal-overlay" onClick={() => setExpandedEventId(null)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    {(() => {
                      const event = events.find(e => e._id === expandedEventId);
                      return event ? (
                        <>
                          <img src={event.image || 'https://via.placeholder.com/300'} alt={event.title} />
                          <h3>{event.title}</h3>
                          <p><strong>Date:</strong> {event.date}</p>
                          <p><strong>Location:</strong> {event.location}</p>
                          <p><strong>Time:</strong> {event.time}</p>

                          <p><strong>Description:</strong></p>
                          <div dangerouslySetInnerHTML={{ __html: event.description }} />

                          <p><strong>Category:</strong> {event.eventctg}</p>
                          <p><strong>Language:</strong> {event.language}</p>
                          <p><strong>Duration:</strong> {event.duration}</p>
                          <p><strong>Age Limit:</strong> {event.agelimit}</p>
                          <p><strong>Price:</strong> ₹{event.price}</p>

                          <button onClick={() => setExpandedEventId(null)}>Close</button>
                        </>
                      ) : null;
                    })()}
                  </div>
                </div>
              )}


            </div>
          </div>
        ))}
      </div>

      {editingEvent && (
        <div className="edit-form">
          <h3>Editing: {formData.title}</h3>
          <input name="title" value={formData.title || ''} onChange={handleChange} placeholder="Title" />
          <ReactQuill
            value={formData.description || ''}
            onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
            theme="snow"
          />

          <input name="date" value={formData.date || ''} onChange={handleChange} placeholder="Date" />
          <input name="location" value={formData.location || ''} onChange={handleChange} placeholder="Location" />
          <input name="time" value={formData.time || ''} onChange={handleChange} placeholder="Time" />
          <input name="eventctg" value={formData.eventctg || ''} onChange={handleChange} placeholder="Category" />
          <input name="language" value={formData.language || ''} onChange={handleChange} placeholder="Language" />
          <input name="duration" value={formData.duration || ''} onChange={handleChange} placeholder="Duration" />
          <input name="agelimit" value={formData.agelimit || ''} onChange={handleChange} placeholder="Age Limit" />
          <input name="price" value={formData.price || ''} onChange={handleChange} placeholder="Price" />
          <input type="file" onChange={handleImageChange} />
          <button onClick={handleUpdate}>✅ Update Event</button>
        </div>
      )}
    </div>
  );
};

export default UpdateEvents;
