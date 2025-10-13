import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./TrendingPropertiesCarousel.css";
import { Heart, MapPin, Ruler, Camera, Star } from "lucide-react";

const TrendingPropertiesCarousel = () => {
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Base URL for API
  const API_BASE_URL = "http://localhost:8000";

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/properties/trending/featured`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch properties: ${response.status}`);
        }

        const propertiesData = await response.json();

        // Transform the data to match our component's expected format
        const transformedProperties = propertiesData.map((property) => ({
          id: property._id,
          _id: property._id,
          title: property.title || "Untitled Property",
          bhk: property.bhk || "Not specified",
          price: property.price || 0,
          size: property.size || "Not specified",
          location: property.location || "Location not specified",
          status: property.status || "Available",
          photos: property.photos || property.image_urls?.length || 0,
          rating: property.rating || 0,
          reviews: property.reviews || 0,
          amenities: property.amenities || [],
          featured: property.featured || false,
          type: property.type || "sale",
          image_urls: property.image_urls || [],
          // Use the first image as the main image, or a placeholder if no images
          image:
            property.image_urls && property.image_urls.length > 0
              ? `${API_BASE_URL}${property.image_urls[0]}`
              : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
        }));

        setProperties(transformedProperties);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError(err.message);
        // Fallback to empty array if API fails
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const toggleFavorite = (propertyId) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? "star-filled" : "star-empty"}
            fill={star <= rating ? "currentColor" : "none"}
          />
        ))}
        <span className="rating-text">({rating})</span>
      </div>
    );
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  if (loading) {
    return (
      <div className="trending-properties-carousel">
        <div className="properties-loading">
          <div className="loading-spinner"></div>
          <p>Loading trending properties...</p>
        </div>
      </div>
    );
  }

  if (error && properties.length === 0) {
    return (
      <div className="trending-properties-carousel">
        <div className="properties-error">
          <p>Unable to load trending properties. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trending-properties-carousel">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={25}
        slidesPerView={1.2}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{
          clickable: true,
          el: ".swiper-pagination",
          type: "bullets",
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          480: { slidesPerView: 1.5 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 3.5 },
          1440: { slidesPerView: 4 },
        }}
        className="properties-swiper"
      >
        {properties.map((property) => (
          <SwiperSlide key={property.id}>
            <div className="property-card">
              {property.featured && (
                <div className="featured-badge">Featured</div>
              )}

              <div className="property-image">
                <img
                  src={property.image}
                  alt={property.bhk}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop";
                  }}
                />
                <button
                  className={`favorite-btn ${
                    favorites.includes(property.id) ? "favorited" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(property.id);
                  }}
                >
                  <Heart
                    size={20}
                    fill={
                      favorites.includes(property.id) ? "currentColor" : "none"
                    }
                  />
                </button>
                <div className="image-overlay">
                  <span className="photo-count">
                    <Camera size={14} />
                    {property.photos}+ Photos
                  </span>
                </div>
              </div>

              <div className="property-content">
                <div className="property-header">
                  <h3 className="property-title">{property.bhk}</h3>
                  <div className="property-price">
                    ₹{property.price?.toLocaleString()}
                  </div>
                </div>

                <div className="property-meta">
                  <div className="meta-item">
                    <Ruler size={16} />
                    <span>{property.size}</span>
                  </div>
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span>{property.location}</span>
                  </div>
                  <div className="meta-item">
                    <span className={`type ${property.type}`}>
                      {property.type === "sale" ? "For Sale" : "For Rent"}
                    </span>
                  </div>
                </div>

                <div className="property-rating">
                  {renderStars(property.rating)}
                  <span className="reviews">({property.reviews} reviews)</span>
                </div>

                <div className="amenities">
                  {property.amenities.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="amenity-tag">
                      {amenity}
                    </span>
                  ))}
                  {property.amenities.length > 3 && (
                    <span className="amenity-tag">
                      +{property.amenities.length - 3}
                    </span>
                  )}
                </div>

                <div className="property-footer">
                  <div
                    className={`status-badge ${property.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {property.status}
                  </div>
                  <button
                    className="view-details-btn"
                    onClick={() => handlePropertyClick(property.id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      <div className="swiper-navigation">
        <button className="swiper-button-prev">‹</button>
        <button className="swiper-button-next">›</button>
      </div>

      {/* Custom Pagination */}
      <div className="swiper-pagination"></div>
    </div>
  );
};

export default TrendingPropertiesCarousel;
