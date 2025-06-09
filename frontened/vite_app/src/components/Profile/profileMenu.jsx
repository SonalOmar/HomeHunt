// src/components/Profile/profileMenu.jsx

import React from "react";
import { Link } from "react-router-dom";

const ProfileMenu = () => {
  return (
    <div
      className="dropdown-menu show position-static mt-2"
      style={{ borderRadius: "6px" }}
    >
      <Link className="dropdown-item" to="/profile">
        Profile
      </Link>
      <Link className="dropdown-item" to="/settings">
        Settings
      </Link>
      <div className="dropdown-divider"></div>
      <Link className="dropdown-item" to="/logout">
        Logout
      </Link>
    </div>
  );
};

export default ProfileMenu;
