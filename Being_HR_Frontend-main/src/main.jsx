import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import Routers from "./Routers";
import { AuthProvider } from "./Components/AuthContext";// Import AuthProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider> {/* Wrap everything in AuthProvider */}
    <BrowserRouter>
      <Routers />
    </BrowserRouter>
  </AuthProvider>
);
