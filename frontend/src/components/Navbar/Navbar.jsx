import React, { useState, useEffect, useRef } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileMenu from "../Profile/profileMenu";
import "./Navbar.css";

const MyNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const toggleProfile = () => setIsProfileOpen((prev) => !prev);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate("/");
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`custom-navbar ${scrolled ? "scrolled" : ""}`}
      variant="dark"
    >
      <Container fluid className="nav-container">
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to="/home" className="brand-logo">
          <span className="brand-main">Home</span>
          <span className="brand-accent">Hunt</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="nav-toggle"
        />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Navigation Links */}
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/all-properties"
              className={`nav-link-custom ${
                location.pathname === "/properties" ? "active" : ""
              }`}
            >
              Properties
            </Nav.Link>

            {isAuthenticated && user?.role === "seller" && (
              <Nav.Link
                as={Link}
                to="/manage-properties"
                className={`nav-link-custom ${
                  location.pathname === "/add-property" ? "active" : ""
                }`}
              >
                Add Property
              </Nav.Link>
            )}
          </Nav>

          {/* Right Navigation */}
          <Nav className="ms-auto right-nav">
            <Nav.Link as={Link} to="/about" className="nav-link-custom">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="nav-link-custom">
              Contact
            </Nav.Link>

            {/* Authentication Section */}
            {isAuthenticated ? (
              // User is logged in - Show profile dropdown
              <div className="profile-dropdown-container" ref={profileRef}>
                <button
                  className="profile-toggle-btn"
                  onClick={toggleProfile}
                  aria-label="Profile menu"
                >
                  <span className="profile-icon">👤</span>
                  {/* <span className="user-name">{user?.name || "User"}</span> */}
                </button>

                {isProfileOpen && (
                  <div className="profile-menu-wrapper">
                    <ProfileMenu
                      onClose={() => setIsProfileOpen(false)}
                      onLogout={handleLogout}
                    />
                  </div>
                )}
              </div>
            ) : (
              // User is not logged in - Show login/register buttons
              <div className="auth-buttons">
                <button className="auth-btn login-btn" onClick={handleLogin}>
                  Login
                </button>
                <button
                  className="auth-btn register-btn"
                  onClick={handleRegister}
                >
                  Register
                </button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
