import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  MapPin,
  Ruler,
  Camera,
  Star,
  ArrowLeft,
  Share2,
  Phone,
  MessageCircle,
  Home,
  Car,
  Wifi,
  Dumbbell,
  Trees,
  Shield,
  Clock,
  User,
  Bed,
  Bath,
  Square,
} from "lucide-react";
import MyNavbar from "../components/Navbar/Navbar";
import FooterComponent from "../components/FooterComponent";
import "./PropertyDetail.css";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Base URL for API
  const API_BASE_URL = "http://localhost:8000";

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/properties/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Property not found");
          }
          throw new Error(`Failed to fetch property: ${response.status}`);
        }

        const propertyData = await response.json();

        // Transform the data to match our component's expected format
        const transformedProperty = {
          _id: propertyData._id,
          id: propertyData._id,
          title: propertyData.title || "Untitled Property",
          bhk: propertyData.bhk || "Not specified",
          price: propertyData.price || 0,
          size: propertyData.size || "Not specified",
          location: propertyData.location || "Location not specified",
          status: propertyData.status || "Available",
          photos: propertyData.photos || 0,
          rating: propertyData.rating || 0,
          reviews: propertyData.reviews || 0,
          amenities: propertyData.amenities || [],
          featured: propertyData.featured || false,
          description: propertyData.description || "No description available",
          fullDescription:
            propertyData.description || "No detailed description available",
          builder: propertyData.builder || "Unknown Builder",
          possession: propertyData.possession || "Not specified",
          floor: propertyData.floor || "Not specified",
          facing: propertyData.facing || "Not specified",
          age: propertyData.age || "Not specified",
          furnished: propertyData.furnished || "Not specified",
          bathrooms: propertyData.bathrooms || 1,
          balconies: propertyData.balconies || 0,
          image_urls: propertyData.image_urls || [],
          additionalImages: propertyData.image_urls || [], // Use image_urls as additionalImages
          created_at: propertyData.created_at,
          owner_name: propertyData.owner_name || "Property Owner",
          owner_email: propertyData.owner_email || "N/A",
        };

        setProperty(transformedProperty);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const toggleFavorite = () => {
    setFavorite(!favorite);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop";
    }

    // If it's already a full URL, return as is
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // If it's a relative path, prepend the base URL
    return `${API_BASE_URL}${imageUrl}`;
  };

  const formatPrice = (price, type = "sale") => {
    if (type === "rent") {
      return `₹${price?.toLocaleString()}/month` || "Price not available";
    }
    return `₹${price?.toLocaleString()}` || "Price not available";
  };

  const renderStars = (rating) => {
    if (!rating || rating === 0) {
      return (
        <div className="property-rating-stars">
          <span className="no-rating">No ratings yet</span>
        </div>
      );
    }

    return (
      <div className="property-rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={star <= rating ? "star-filled" : "star-empty"}
            fill={star <= rating ? "currentColor" : "none"}
          />
        ))}
        <span className="property-rating-text">({rating})</span>
      </div>
    );
  };

  const getAmenityIcon = (amenity) => {
    const amenityIcons = {
      "Swimming Pool": Car,
      Swimming: Car,
      Gym: Dumbbell,
      Park: Trees,
      Security: Shield,
      Wifi: Wifi,
      Parking: Car,
      Clubhouse: Home,
      "Power Backup": Shield,
      Lift: Shield,
      "Water Supply": Shield,
      "Maintenance Staff": User,
      "Children's Play Area": Trees,
      "Jogging Track": Trees,
      "Community Hall": Home,
      Garden: Trees,
    };

    const IconComponent = amenityIcons[amenity] || Home;
    return <IconComponent size={20} />;
  };

  const getBhkNumber = (bhkString) => {
    if (!bhkString) return 1;
    const match = bhkString.toString().match(/\d+/);
    return match ? parseInt(match[0]) : 1;
  };

  if (loading) {
    return (
      <div className="property-detail-page">
        <MyNavbar />
        <div className="property-loading">
          <div className="loading-spinner"></div>
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-not-found">
        <MyNavbar />
        <div className="property-container">
          <h2>Property Not Found</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate("/properties")}
            className="property-back-btn"
          >
            <ArrowLeft size={20} />
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="property-not-found">
        <MyNavbar />
        <div className="property-container">
          <h2>Property Not Found</h2>
          <p>The property you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/properties")}
            className="property-back-btn"
          >
            <ArrowLeft size={20} />
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const bhkNumber = getBhkNumber(property.bhk);
  const displayImages =
    property.additionalImages && property.additionalImages.length > 0
      ? property.additionalImages
      : property.image_urls;

  return (
    <div className="property-detail-page">
      <MyNavbar />

      {/* Back Navigation */}
      <div className="property-page-nav">
        <div className="property-container">
          <button onClick={() => navigate(-1)} className="property-back-btn">
            <ArrowLeft size={20} />
            Back to Properties
          </button>
        </div>
      </div>

      {/* Property Images */}
      <section className="property-images-section">
        <div className="property-container">
          <div className="property-images-grid">
            <div className="property-main-image">
              <img
                src={getImageUrl(displayImages?.[activeImage])}
                alt={property.title}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop";
                }}
              />
              {property.featured && (
                <div className="property-featured-badge">Featured</div>
              )}
              <button
                className={`property-favorite-btn large ${
                  favorite ? "favorited" : ""
                }`}
                onClick={toggleFavorite}
              >
                <Heart size={24} fill={favorite ? "currentColor" : "none"} />
              </button>
            </div>

            {displayImages && displayImages.length > 1 && (
              <div className="property-thumbnail-images">
                {displayImages.map((img, index) => (
                  <div
                    key={index}
                    className={`property-thumbnail ${
                      activeImage === index ? "active" : ""
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${property.title} ${index + 1}`}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=150&fit=crop";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="property-details-section">
        <div className="property-container">
          <div className="property-details-grid">
            {/* Main Content */}
            <div className="property-main-content">
              {/* Property Header */}
              <div className="property-detail-header">
                <div className="property-title-section">
                  <h1>{property.title}</h1>
                  <div className="property-location">
                    <MapPin size={20} />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="property-price-section">
                  <h2 className="property-price">
                    {formatPrice(property.price, property.type)}
                  </h2>
                  <div className="property-action-buttons">
                    <button className="property-share-btn">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="property-detail-stats">
                <div className="property-stat">
                  <Bed size={20} />
                  <span>{bhkNumber} BHK</span>
                </div>
                <div className="property-stat">
                  <Bath size={20} />
                  <span>{property.bathrooms} Bath</span>
                </div>
                <div className="property-stat">
                  <Square size={20} />
                  <span>{property.size}</span>
                </div>
                <div className="property-stat">
                  <Clock size={20} />
                  <span>{property.status}</span>
                </div>
                {property.possession &&
                  property.possession !== "Not specified" && (
                    <div className="property-stat">
                      <span>Possession: {property.possession}</span>
                    </div>
                  )}
              </div>

              {/* Rating */}
              {(property.rating > 0 || property.reviews > 0) && (
                <div className="property-detail-rating">
                  {renderStars(property.rating)}
                  {property.reviews > 0 && (
                    <span className="property-reviews">
                      ({property.reviews} reviews)
                    </span>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="property-description-section">
                <h3>Description</h3>
                <p>{property.fullDescription}</p>
              </div>

              {/* Property Features */}
              <div className="property-features-section">
                <h3>Property Features</h3>
                <div className="property-features-grid">
                  {property.builder &&
                    property.builder !== "Unknown Builder" && (
                      <div className="property-feature">
                        <strong>Builder</strong>
                        <span>{property.builder}</span>
                      </div>
                    )}
                  {property.floor && property.floor !== "Not specified" && (
                    <div className="property-feature">
                      <strong>Floor</strong>
                      <span>{property.floor}</span>
                    </div>
                  )}
                  {property.facing && property.facing !== "Not specified" && (
                    <div className="property-feature">
                      <strong>Facing</strong>
                      <span>{property.facing}</span>
                    </div>
                  )}
                  {property.age && property.age !== "Not specified" && (
                    <div className="property-feature">
                      <strong>Age</strong>
                      <span>{property.age}</span>
                    </div>
                  )}
                  {property.furnished &&
                    property.furnished !== "Not specified" && (
                      <div className="property-feature">
                        <strong>Furnishing</strong>
                        <span>{property.furnished}</span>
                      </div>
                    )}
                  <div className="property-feature">
                    <strong>Bathrooms</strong>
                    <span>{property.bathrooms}</span>
                  </div>
                  {property.balconies > 0 && (
                    <div className="property-feature">
                      <strong>Balconies</strong>
                      <span>{property.balconies}</span>
                    </div>
                  )}
                  {property.photos > 0 && (
                    <div className="property-feature">
                      <strong>Photos</strong>
                      <span>{property.photos}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="property-amenities-section">
                  <h3>Amenities</h3>
                  <div className="property-amenities-grid">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="property-amenity-item">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Contact & Actions */}
            <div className="property-sidebar">
              <div className="property-contact-card">
                <h3>Contact Owner</h3>
                <div className="property-agent-info">
                  <div className="property-agent-avatar">
                    <User size={24} />
                  </div>
                  <div className="property-agent-details">
                    <strong>{property.owner_name}</strong>
                    <span>Verified Seller</span>
                    {property.owner_email && property.owner_email !== "N/A" && (
                      <span className="property-agent-email">
                        {property.owner_email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="property-contact-buttons">
                  <button className="property-contact-btn primary">
                    <Phone size={20} />
                    Call Now
                  </button>
                  <button className="property-contact-btn secondary">
                    <MessageCircle size={20} />
                    Send Message
                  </button>
                </div>

                <div className="property-schedule-visit">
                  <h4>Schedule a Visit</h4>
                  <button className="property-visit-btn">
                    Book Site Visit
                  </button>
                </div>
              </div>

              <div className="property-quick-actions">
                <button className="property-action-btn">📋 Get Brochure</button>
                <button className="property-action-btn">📍 View on Map</button>
                <button className="property-action-btn">
                  💰 Loan Eligibility
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <FooterComponent /> */}
    </div>
  );
};

export default PropertyDetail;
