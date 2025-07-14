import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Booking.css";

const Booking = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [user, setUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    officialEmail: "",
    designation: "",
    organisation: "",
    location: "",
    linkedin: "",
    eventName: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/eventdetails/${id}`);
        setEventData(res.data);
        setFormData((prev) => ({ ...prev, eventName: res.data.title }));
      } catch (err) {
        console.error("Error fetching event data:", err);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user`, { withCredentials: true });
        setUser(res.data);
        setFormData((prev) => ({
          ...prev,
          name: res.data.name || "",
          email: res.data.email || "" // Prefill personal email with user's email
        }));
        if (res.data.registeredEvents.includes(id)) {
          setIsRegistered(true);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchEvent();
    fetchUser();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";
    switch (name) {
      case "name":
        if (!/^[a-zA-Z\s]{3,}$/.test(value)) {
          errorMsg = "Name should be at least 3 characters and contain only letters and spaces.";
        }
        break;
      case "phone":
        if (!/^\d{10}$/.test(value)) {
          errorMsg = "Phone number must be a valid 10-digit number.";
        }
        break;
      case "email":
      case "officialEmail":
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          errorMsg = "Please enter a valid email address.";
        }
        break;
      case "age":
        if (value && (value < 18 || value > 100)) {
          errorMsg = "Age must be between 18 and 100.";
        }
        break;
      case "linkedin":
        if (value && !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(value)) {
          errorMsg = "Please enter a valid LinkedIn URL.";
        }
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).some((msg) => msg)) {
      alert("Please fix the errors before submitting.");
      return;
    }
    try {
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/eventregistration`,
    { ...formData, eventId: id },
    { withCredentials: true }
  );
  console.log("Registration successful:", response.data);
  // Use backend message if available, fallback to default
  alert(response.data?.message || "Registration successful!");
  setIsRegistered(true);
} catch (error) {
  console.error("Error submitting the form:", error);
  // Use backend error message if available, else fallback
  alert(error.response?.data?.message || "Something went wrong while registering. Please try again.");
}

  };

  if (!eventData) return <p>Loading event details...</p>;

  return (
    <div className="event-detail-page">
      <header className="event-header">
        <h1>Register for {eventData.title}</h1>
      </header>

      <section className="f-registration-form">
        <form onSubmit={handleSubmit}>
          <div className="f-form-field">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              readOnly={!!user}
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          <div className="f-form-field">
            <label htmlFor="designation">Designation</label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="f-form-field">
            <label htmlFor="organisation">Organisation</label>
            <input
              type="text"
              id="organisation"
              name="organisation"
              value={formData.organisation}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="f-form-field">
            <label htmlFor="email">Personal Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              readOnly={!!user}
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="f-form-field">
            <label htmlFor="officialEmail">Official Email</label>
            <input
              type="email"
              id="officialEmail"
              name="officialEmail"
              value={formData.officialEmail}
              onChange={handleInputChange}
              required
            />
            {errors.officialEmail && <span className="error-msg">{errors.officialEmail}</span>}
          </div>

          <div className="f-form-field">
            <label htmlFor="phone">Contact Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            {errors.phone && <span className="error-msg">{errors.phone}</span>}
          </div>

          <div className="f-form-field">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="f-form-field">
            <label htmlFor="linkedin">LinkedIn URL</label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
            />
            {errors.linkedin && <span className="error-msg">{errors.linkedin}</span>}
          </div>

          <input type="hidden" name="eventName" value={formData.eventName} />

          <div className="f-form-field">
            <button type="submit" className="submit-button" disabled={isRegistered}>
              {isRegistered ? "Already Registered" : "Submit"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Booking;
