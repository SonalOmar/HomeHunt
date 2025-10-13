import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      // Use the AuthContext login function instead of localStorage directly
      if (response.data.access_token) {
        login(response.data.user, response.data.access_token);

        // Show success message
        alert("🎉 Registration successful! Redirecting to home page...");

        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        alert(
          "⚠️ Registration completed but no authentication token received. Please login."
        );
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const errorDetail = error.response.data.detail;

        switch (status) {
          case 400:
            if (errorDetail === "Email already registered") {
              setErrors({
                email:
                  "This email is already registered. Please use a different email or login.",
              });
            } else {
              setErrors({
                general:
                  "Invalid registration data. Please check your information.",
              });
            }
            break;
          case 422:
            setErrors({
              general:
                "Validation error. Please check all fields are filled correctly.",
            });
            break;
          case 500:
            setErrors({ general: "Server error. Please try again later." });
            break;
          default:
            setErrors({
              general: errorDetail || "Registration failed. Please try again.",
            });
        }
      } else if (error.request) {
        // Request was made but no response received
        setErrors({
          general:
            "Network error. Please check your internet connection and try again.",
        });
      } else {
        // Something else happened
        setErrors({
          general: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Clear individual field error when user starts typing
  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Create Your Account</h2>
        <p className="subtitle">Join us to find your perfect property</p>

        {errors.general && (
          <div className="error-message general-error">⚠️ {errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError("name");
              }}
              required
              disabled={loading}
              className={errors.name ? "error" : ""}
            />
            {errors.name && (
              <span className="field-error">⚠️ {errors.name}</span>
            )}
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError("email");
              }}
              required
              disabled={loading}
              className={errors.email ? "error" : ""}
            />
            {errors.email && (
              <span className="field-error">⚠️ {errors.email}</span>
            )}
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password (min. 6 characters)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError("password");
              }}
              required
              disabled={loading}
              className={errors.password ? "error" : ""}
            />
            {errors.password && (
              <span className="field-error">⚠️ {errors.password}</span>
            )}
          </div>

          <div className="input-group">
            <label>I want to:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <option value="buyer">🏠 Buy a property</option>
              <option value="seller">💰 Sell a property</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={loading ? "loading" : ""}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="login-link">
            Already have an account? <a href="/login">Sign in here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
