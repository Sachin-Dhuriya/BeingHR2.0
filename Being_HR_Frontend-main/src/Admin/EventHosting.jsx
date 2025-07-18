import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EventHosting.css";
import TextEditor from "./TextEditor";

function EventHosting() {
    const [event, setEvent] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        time: "",
        eventctg: "",
        language: "",
        duration: "",
        agelimit: "",
        price: "",
        image: null
    });

    const [loading, setLoading] = useState(false);
    const [adminLoading, setAdminLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/check-admin`, { withCredentials: true });
                if (!res.data.isAdmin) {
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

    const handleChange = (e) => {
        setEvent({ ...event, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEvent({ ...event, image: file });
    };

    // Function to handle description change from TextEditor
    const handleDescriptionChange = (description) => {
        setEvent({ ...event, description });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        Object.keys(event).forEach((key) => {
            formData.append(key, event[key]);
        });

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/events/add-event`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert(res.data.message);
            setEvent({
                title: "",
                description: "",
                date: "",
                location: "",
                time: "",
                eventctg: "",
                language: "",
                duration: "",
                agelimit: "",
                price: "",
                image: null
            });
        } catch (error) {
            console.error("Error while adding event:", error);
            setError(`Failed to add event. Please try again. ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (adminLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="event-container">
            <h5 className="Host-event-heading">Add New Event</h5>
            {error && <p className="error-message">{error}</p>}
            <form className="event-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    className="event-input"
                    placeholder="Title"
                    value={event.title}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="date"
                    className="event-input"
                    value={event.date}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="location"
                    className="event-input"
                    placeholder="Location"
                    value={event.location}
                    onChange={handleChange}
                    required
                />
                <input
                    type="time"
                    name="time"
                    className="event-input"
                    value={event.time}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="eventctg"
                    className="event-input"
                    placeholder="Event Category"
                    value={event.eventctg}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="language"
                    className="event-input"
                    placeholder="Language"
                    value={event.language}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="duration"
                    className="event-input"
                    placeholder="Event Duration (minutes)"
                    value={event.duration}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="agelimit"
                    className="event-input"
                    placeholder="Age Limit"
                    value={event.agelimit}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="price"
                    className="event-input"
                    placeholder="Price"
                    value={event.price}
                    onChange={handleChange}
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    className="event-input"
                    onChange={handleImageChange}
                />
                {/* TextEditor component with onChange handler */}
                <TextEditor onChange={handleDescriptionChange} />

                <button type="submit" className="event-button" disabled={loading}>
                    {loading ? "Adding Event..." : "Add Event"}
                </button>
            </form>
        </div>
    );
}

export default EventHosting;
