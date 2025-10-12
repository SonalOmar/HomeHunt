// src/components/Profile/profileMenu.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProfileMenu = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose && onClose();
    navigate("/");
    // Optional: Show logout success message
    alert("👋 Logged out successfully!");
  };

  const handleProfileClick = () => {
    onClose && onClose();
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    onClose && onClose();
    navigate("/settings");
  };

  return (
    <div
      className="dropdown-menu show position-static mt-2"
      style={{
        borderRadius: "6px",
        minWidth: "200px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        border: "1px solid #dee2e6",
      }}
    >
      {/* User Info Header */}
      <div className="dropdown-header px-3 py-2">
        <div className="fw-bold text-dark">{user?.name}</div>
        <div className="small text-muted">{user?.email}</div>
        <div className="small text-primary mt-1">
          <span
            className={`badge ${
              user?.role === "seller" ? "bg-warning" : "bg-info"
            }`}
          >
            {user?.role?.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="dropdown-divider my-1"></div>

      {/* Menu Items */}
      <button
        className="dropdown-item d-flex align-items-center py-2"
        onClick={handleProfileClick}
        style={{
          cursor: "pointer",
          border: "none",
          background: "none",
          width: "100%",
          textAlign: "left",
        }}
      >
        <i className="fas fa-user me-2 text-muted"></i>
        <span>Profile</span>
      </button>

      <button
        className="dropdown-item d-flex align-items-center py-2"
        onClick={handleSettingsClick}
        style={{
          cursor: "pointer",
          border: "none",
          background: "none",
          width: "100%",
          textAlign: "left",
        }}
      >
        {/* <i className="fas fa-cog me-2 text-muted"></i>
        <span>Settings</span> */}
      </button>

      <div className="dropdown-divider my-1"></div>

      {/* Logout Button */}
      <button
        className="dropdown-item d-flex align-items-center py-2 text-danger"
        onClick={handleLogout}
        style={{
          cursor: "pointer",
          border: "none",
          background: "none",
          width: "100%",
          textAlign: "left",
        }}
      >
        <i className="fas fa-sign-out-alt me-2"></i>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default ProfileMenu;
