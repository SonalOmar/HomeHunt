import React from "react";
import { Shield, TrendingUp, Star, Home, Users, MapPin } from "lucide-react";
import MyNavbar from "../components/Navbar/Navbar";

import "./About.css";

const About = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified Properties",
      description:
        "Every listing is thoroughly verified to ensure authenticity and quality standards.",
    },
    {
      icon: TrendingUp,
      title: "Best Market Prices",
      description:
        "Get the most competitive prices with our direct owner and builder connections.",
    },
    {
      icon: Star,
      title: "Premium Service",
      description:
        "Experience personalized service from our expert real estate consultants.",
    }
  ];

  const stats = [
    { number: "10,000+", label: "Properties Listed", icon: Home },
    { number: "5,000+", label: "Happy Customers", icon: Users },

    { number: "98%", label: "Customer Satisfaction", icon: Star },
  ];

  return (
    <div className="about-page">
      <MyNavbar />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>About HomeHunt</h1>
            <p className="hero-subtitle">
              Your trusted platform for finding the perfect property. We connect
              buyers, sellers, and renters with verified listings and expert
              guidance.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="what-we-do">
        <div className="container">
          <div className="section-content">
            <h2>What We Do</h2>
            <p>
              HomeHunt is a comprehensive real estate platform that simplifies
              property search and transactions. We provide a seamless experience
              for buying, selling, and renting properties with complete
              transparency and security.
            </p>
            <div className="stats-grid">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="stat-card">
                    <div className="stat-icon">
                      <IconComponent size={28} />
                    </div>
                    <h3>{stat.number}</h3>
                    <p>{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose HomeHunt?</h2>
          <div className="features-grid">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <IconComponent size={32} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              To make property hunting simple, transparent, and accessible for
              everyone. We leverage technology to provide the best real estate
              experience while maintaining the human touch that our customers
              deserve.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
