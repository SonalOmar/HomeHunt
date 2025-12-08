// src/pages/Profile/Profile.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import "./ProfilePage.css";

const Profile = () => {
  const { user, updateUser, token } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const API_BASE_URL = "http://localhost:8000";

  // Fetch user data from backend when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) {
        setFetching(false);
        return;
      }

      try {
        setFetching(true);
        const token = localStorage.getItem("token");

        console.log("Fetching user data for:", user.email);
        console.log("Using token:", token);

        const response = await fetch(
          `${API_BASE_URL}/users/${encodeURIComponent(user.email)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Authentication failed. Please log in again.");
          } else if (response.status === 403) {
            throw new Error("Permission denied to access user data");
          } else if (response.status === 404) {
            throw new Error("User not found");
          }
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }

        const userDataFromAPI = await response.json();
        console.log("User data fetched:", userDataFromAPI);

        // Initialize form data with fetched user data - only name and email
        setFormData({
          name: userDataFromAPI.name || "",
          email: userDataFromAPI.email || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage({
          type: "error",
          text: error.message || "Failed to load profile data",
        });

        // Fallback to context user data
        if (user) {
          setFormData({
            name: user.name || "",
            email: user.email || "",
          });
        }
      } finally {
        setFetching(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      console.log("Updating user with data:", formData);

      const response = await fetch(
        `${API_BASE_URL}/users/${encodeURIComponent(user.email)}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            role: user.role, // Keep the same role
            password: user.password, // Keep the same password (required by User model)
          }),
        }
      );

      console.log("Update response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Failed to update profile: ${response.status}`
        );
      }

      // Update user in context and localStorage
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
      };
      updateUser(updatedUser);

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current user data
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setEditMode(false);
    setMessage({ type: "", text: "" });
  };

  if (!user) {
    return (
      <Container className="profile-container">
        <div className="text-center">
          <h2>Please log in to view your profile</h2>
        </div>
      </Container>
    );
  }

  if (fetching) {
    return (
      <Container className="profile-container">
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading your profile...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="profile-container">
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="profile-header mb-4">
            <h1 className="profile-title">My Profile</h1>
            <p className="profile-subtitle">Manage your account information</p>
          </div>

          {message.text && (
            <Alert variant={message.type === "success" ? "success" : "danger"}>
              {message.text}
            </Alert>
          )}

          <Card className="profile-card">
            <Card.Body>
              {/* User Role Badge */}
              <div className="text-end mb-4">
                <span className={`role-badge ${user.role}`}>
                  {user.role?.toUpperCase()}
                </span>
              </div>

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      {editMode ? (
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                          minLength={1}
                          maxLength={100}
                        />
                      ) : (
                        <div className="profile-field-value">
                          {user.name || "Not provided"}
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      {editMode ? (
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          disabled={loading}
                        />
                      ) : (
                        <div className="profile-field-value">{user.email}</div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                {/* Account Statistics */}
                {!editMode && (
                  <div className="profile-stats mt-4">
                    <h5>Account Overview</h5>
                    <Row>
                      <Col sm={6} className="mb-3">
                        <div className="stat-item">
                          <div className="stat-label">Account Type</div>
                          <div className="stat-value">
                            {user.role === "seller"
                              ? "Property Seller"
                              : "Property Buyer"}
                          </div>
                        </div>
                      </Col>
                      <Col sm={6} className="mb-3">
                        <div className="stat-item">
                          <div className="stat-label">Member Since</div>
                          <div className="stat-value">
                            {user.created_at
                              ? new Date(user.created_at).toLocaleDateString()
                              : "Recent"}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="profile-actions mt-4">
                  {editMode ? (
                    <div className="d-flex gap-2">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline-primary"
                      onClick={() => setEditMode(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Property Management Actions */}
          <Card className="action-card mt-4">
            <Card.Body>
              <h5>Property Management</h5>
              <div className="action-links">
                <a href="/all-properties/*" className="action-link">
                  Browse Properties
                </a>
                {user.role === "seller" && (
                  <a href="/manage-properties" className="action-link">
                    Add New Property
                  </a>
                )}
                
                <a href="/favorites" className="action-link">
                  My Favorites
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
