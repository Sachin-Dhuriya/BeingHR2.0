import React, { useEffect } from "react";
import { useAuth } from "../AuthContext"; 
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for authentication response from the backend
    fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/user`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.email) {
          localStorage.setItem("user", JSON.stringify(data));
          navigate("/"); // Redirect to homepage
        }
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Sign in to Continue</h2>
        <button onClick={login} className="google-login-btn">
          <img
            src="https://w7.pngwing.com/pngs/882/225/png-transparent-google-logo-google-logo-google-search-icon-google-text-logo-business.png"
            alt="Google Logo"
            className="google-logo"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default Login;