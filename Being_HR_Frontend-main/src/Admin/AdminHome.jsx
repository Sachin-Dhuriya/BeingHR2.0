import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHome.css";

// Dummy data for the cards
const cards = [
  {
    title: "Create Event",
    description: "View and manage the admin profile details.",
    link: "/createevent"
  },
  {
    title: "Events Registration",
    description: "Register and manage upcoming events.",
    link: "/events-registration"
  },
  {
    title: "Users Details",
    description: "View and manage user details.",
    link: "/admin-user-records"
  },
  {
    title: "User Queries",
    description: "View and respond to user queries.",
    link: "/admin-user-querys"
  },
  {
    title: "HomePage Container",
    description: "Handle the Homepage container from here",
    link: "/HomepageSectionForm"
  },
  {
    title: "HomePage Cards",
    description: "Handle the Homepage Cards from here",
    link: "/HomepageCard"
  },
  {
    title: "Voice Cards",
    description: "Handle the Homepage Voice Cards from here",
    link: "/VoiceCard"
  }
];

const AdminHome = () => {
  const [isAdmin, setIsAdmin] = useState(null); // `null` means loading
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/check-admin`, { credentials: "include" }) // Fetch admin status from the backend
      .then((res) => res.json())
      .then((data) => {
        if (!data.isAdmin) {
          navigate("/404"); // Redirect non-admin users
        } else {
          setIsAdmin(true);
        }
      })
      .catch(() => navigate("/404"));
  }, [navigate]);

  if (isAdmin === null) {
    return <h2>Loading...</h2>; // Show a loading state while checking admin status
  }

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-container">
        {cards.map((card, index) => (
          <div key={index} className="card">
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <a href={card.link} className="card-link">Go to {card.title}</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminHome;
