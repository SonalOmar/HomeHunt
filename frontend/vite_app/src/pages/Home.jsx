import { Carousel } from "react-bootstrap";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import FooterComponent from "../components/FooterComponent";
import React from "react";
import MyNavbar from "../components/Navbar/Navbar";
import TrendingPropertiesCarousel from "../components/Carousel/TrendingPropertiesCarousel";
import {
  Search,
  Home,
  TrendingUp,
  Shield,
  Star,
  MapPin,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Home.css";

export default function HomePage() {
  const navigate = useNavigate(); // Initialize navigate

const handleListProperty = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      // Check if user is seller or admin
      if (user.role === "seller" || user.role === "admin") {
        navigate("/manage-properties");
      } else {
        alert(
          "Only sellers and admins can list properties. Please contact support to upgrade your account."
        );
        // Optionally redirect to upgrade page or show upgrade modal
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  } else {
    alert("Please login to list your property");
    navigate("/login");
  }
};

  const handleBrowseProperties = () => {
    // Navigate to properties page or show all properties
    navigate("/all-properties"); // You might need to create this route
  };

  return (
    <div className="home-container">
      <MyNavbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <img
            src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=80"
            alt="Luxury Home"
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <h1 className="hero-title">Find Your Dream Property</h1>
              <p className="hero-subtitle">
                Discover the perfect home from our extensive collection of
                premium properties. Buy, rent, or invest in your future today.
              </p>

              <div className="hero-buttons">
                <button className="browse-btn" onClick={handleBrowseProperties}>
                  <Search size={20} />
                  Browse Properties
                  <ArrowRight size={16} />
                </button>
                <button className="list-btn" onClick={handleListProperty}>
                  <Plus size={20} />
                  List Your Property
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <TrendingUp className="feature-icon" />
              </div>
              <h3>Best Market Prices</h3>
              <p>Competitive pricing across all property listings</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Shield className="feature-icon" />
              </div>
              <h3>Secure Transactions</h3>
              <p>Safe and verified property deals every time</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Star className="feature-icon" />
              </div>
              <h3>24/7 Support</h3>
              <p>Expert assistance whenever you need it</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search Section
      <section className="quick-search-section">
        <div className="container">
          <div className="search-card">
            <h2>Find Your Perfect Match</h2>
            <p>Search through thousands of verified properties</p>
            <div className="search-filters">
              <select className="filter-select">
                <option>Buy</option>
                <option>Rent</option>
                <option>Commercial</option>
              </select>
              <select className="filter-select">
                <option>Any Type</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>Office</option>
                <option>Land</option>
              </select>
              <div className="location-input">
                <MapPin size={20} />
                <input type="text" placeholder="Enter location..." />
              </div>
              <button className="search-btn">
                <Search size={20} />
                Search
              </button>
            </div>
          </div>
        </div>
      </section> */}

      {/* Trending Properties */}
      <section className="trending-section">
        <div className="container">
          <div className="section-header">
            <h2>Trending Properties</h2>
            <p>Discover the most popular listings in the market</p>
          </div>
          <TrendingPropertiesCarousel />
        </div>
      </section>

      {/* <FooterComponent /> */}
    </div>
  );
}
