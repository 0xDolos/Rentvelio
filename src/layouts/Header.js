import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Header.css";

function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <header>
      <div className="header-left">
        <Link to="/submit-rent">Submit Rent</Link>
        <Link to="/create-listing">Manage Rentals</Link>
        <Link to="/advertise">Advertise</Link>
      </div>

      <Link to="/" className="logo">
        <h1>Rentvelio</h1>
        <p>See What Others Pay</p>
      </Link>

      <div className="header-right">
        <Link to="/help">Help</Link>
        {currentUser ? (
          <Link onClick={handleLogout}>Logout</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
}

export default Header;
