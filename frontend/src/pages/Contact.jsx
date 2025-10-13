import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import MyNavbar from "../components/Navbar/Navbar";

import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (555) 123-4567",
      description: "Mon to Fri 9am to 6pm",
    },
    {
      icon: Mail,
      title: "Email",
      details: "hello@homehunt.com",
      description: "Send us your query anytime",
    },
    {
      icon: MapPin,
      title: "Office",
      details: "123 Business District",
      description: "Bangalore, India - 560001",
    },
    {
      icon: Clock,
      title: "Timing",
      details: "Monday - Friday",
      description: "9:00 AM - 6:00 PM",
    },
  ];

  return (
    <div className="contact-page">
      <MyNavbar />

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Get In Touch</h1>
            <p>
              We're here to help you find your dream property. Reach out to us
              with any questions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-container">
              <div className="form-header">
                <MessageCircle size={32} />
                <h2>Send us a Message</h2>
                <p>
                  Fill out the form below and we'll get back to you within 24
                  hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="buying">Buying a Property</option>
                      <option value="selling">Selling a Property</option>
                      <option value="renting">Renting a Property</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-container">
              <div className="info-header">
                <h2>Contact Information</h2>
                <p>Choose your preferred method to reach us</p>
              </div>

              <div className="contact-info-list">
                {contactInfo.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="contact-info-item">
                      <div className="info-icon">
                        <IconComponent size={24} />
                      </div>
                      <div className="info-content">
                        <h3>{item.title}</h3>
                        <p className="info-detail">{item.details}</p>
                        <p className="info-description">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="action-btn primary">📞 Call Now</button>
                  <button className="action-btn secondary">📧 Email Us</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

   
    </div>
  );
};

export default Contact;
