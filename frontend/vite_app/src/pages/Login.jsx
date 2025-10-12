import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
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
      const response = await axios.post("http://localhost:8000/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      // Use the AuthContext login function instead of localStorage directly
      if (response.data.access_token) {
        login(response.data.user, response.data.access_token);

        // Show success message
        alert("✅ Login successful! Redirecting to home page...");

        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        alert("⚠️ Login completed but no authentication token received.");
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const errorDetail = error.response.data.detail;

        switch (status) {
          case 401:
            setErrors({
              general:
                "Invalid email or password. Please check your credentials and try again.",
            });
            break;
          case 400:
            setErrors({ general: "Invalid request. Please check your input." });
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
              general: errorDetail || "Login failed. Please try again.",
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
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to your account</p>

        {errors.general && (
          <div className="error-message general-error">⚠️ {errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError("email");
                clearError("general");
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
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError("password");
                clearError("general");
              }}
              required
              disabled={loading}
              className={errors.password ? "error" : ""}
            />
            {errors.password && (
              <span className="field-error">⚠️ {errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={loading ? "loading" : ""}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="register-link">
            Don't have an account? <a href="/register">Create one here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
