import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Filter,
  Home,
  MapPin,
  Bed,
  Bath,
  Square,
  SlidersHorizontal,
  X,
  Star,
  Clock,
} from "lucide-react";
import MyNavbar from "../components/Navbar/Navbar";
import FooterComponent from "../components/FooterComponent";
import "./AllProperties.css";

const AllProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter states - INCREASED DEFAULT PRICE RANGE
  const [filters, setFilters] = useState({
    type: "all",
    priceRange: [0, 50000000], // Increased to 50 million
    bhk: "all",
    propertyType: "all",
    location: "",
    sortBy: "newest",
  });

  // Base URL for API
  const API_BASE_URL = "http://localhost:8000";

  // Fetch properties from API
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/properties/`);

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.status}`);
      }

      const data = await response.json();

      console.log("Raw API response - Total properties:", data.length);

      // Log all properties with their prices to debug
      data.forEach((property, index) => {
        console.log(`Property ${index + 1}:`, {
          title: property.title,
          price: property.price,
          type: property.type,
          bhk: property.bhk,
        });
      });

      // Transform the data to match our component's expected format
      const transformedProperties = data.map((property) => ({
        _id: property._id,
        id: property._id,
        title: property.title || "Untitled Property",
        description: property.description || "No description available",
        type: property.type || "sale",
        price: property.price || 0,
        location: property.location || "Location not specified",
        bhk: property.bhk ? parseInt(property.bhk) || 1 : 1, // Safer parsing
        bathrooms: property.bathrooms || 1,
        size: property.size || "0 sq ft",
        image_urls: property.image_urls || [],
        featured: property.featured || false,
        rating: property.rating || 0,
        created_at: property.created_at || new Date().toISOString(),
        status: property.status || "Available",
        photos: property.photos || 0,
        reviews: property.reviews || 0,
        amenities: property.amenities || [],
        fullDescription:
          property.description || "No detailed description available",
        builder: property.builder || "Unknown Builder",
        possession: property.possession || "Not specified",
        floor: property.floor || "Not specified",
        facing: property.facing || "Not specified",
        age: property.age || "Not specified",
        furnished: property.furnished || "Not specified",
        balconies: property.balconies || 0,
        additionalImages: property.image_urls || [],
      }));

      console.log(
        "Transformed properties count:",
        transformedProperties.length
      );

      setProperties(transformedProperties);
      setFilteredProperties(transformedProperties);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to fetch properties. Please try again later.");
      setProperties([]);
      setFilteredProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Apply filters with detailed logging
  useEffect(() => {
    console.log("=== APPLYING FILTERS ===");
    console.log("Total properties before filtering:", properties.length);
    console.log("Current filters:", filters);

    let filtered = [...properties];

    // Filter by type
    if (filters.type !== "all") {
      const beforeType = filtered.length;
      filtered = filtered.filter((property) => property.type === filters.type);
      console.log(
        `After type filter (${filters.type}): ${beforeType} -> ${filtered.length}`
      );
    }

    // Filter by price range - WITH DEBUGGING
    const beforePrice = filtered.length;
    filtered = filtered.filter((property) => {
      const price = property.price || 0;
      const inRange =
        price >= filters.priceRange[0] && price <= filters.priceRange[1];

      // Log properties that get filtered out by price
      if (!inRange) {
        console.log(
          `Property filtered by price: "${property.title}" - Price: ${price}, Range: [${filters.priceRange[0]}, ${filters.priceRange[1]}]`
        );
      }

      return inRange;
    });
    console.log(`After price filter: ${beforePrice} -> ${filtered.length}`);

    // Filter by BHK - WITH SAFER PARSING
    if (filters.bhk !== "all") {
      const beforeBHK = filtered.length;
      const targetBhk = parseInt(filters.bhk);
      filtered = filtered.filter((property) => {
        const propertyBhk = property.bhk;
        const matches = propertyBhk === targetBhk;

        if (!matches) {
          console.log(
            `Property filtered by BHK: "${property.title}" - BHK: ${propertyBhk}, Required: ${targetBhk}`
          );
        }

        return matches;
      });
      console.log(
        `After BHK filter (${filters.bhk}): ${beforeBHK} -> ${filtered.length}`
      );
    }

    // Filter by location
    if (filters.location) {
      const beforeLocation = filtered.length;
      filtered = filtered.filter((property) =>
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
      console.log(
        `After location filter: ${beforeLocation} -> ${filtered.length}`
      );
    }

    // Sort properties
    switch (filters.sortBy) {
      case "price-low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
      default:
        break;
    }

    console.log("Final filtered properties count:", filtered.length);
    console.log(
      "Filtered properties:",
      filtered.map((p) => ({ title: p.title, price: p.price, bhk: p.bhk }))
    );
    console.log("=========================");

    setFilteredProperties(filtered);
  }, [filters, properties]);

  const handleFilterChange = (key, value) => {
    console.log(`Filter changed: ${key} =`, value);
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    console.log("Resetting filters to default");
    setFilters({
      type: "all",
      priceRange: [0, 50000000], // Reset to larger range
      bhk: "all",
      propertyType: "all",
      location: "",
      sortBy: "newest",
    });
  };

  const formatPrice = (price, type) => {
    if (type === "rent") {
      return `₹${price.toLocaleString()}/month`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const handlePropertyClick = (property) => {
    navigate(`/property/${property.id}`);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=300&fit=crop";
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `${API_BASE_URL}${imageUrl}`;
  };

  const PropertyCard = ({ property }) => (
    <div
      className="property-card"
      onClick={() => handlePropertyClick(property)}
    >
      <div className="property-image">
        <img
          src={getImageUrl(property.image_urls?.[0])}
          alt={property.title}
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=300&fit=crop";
          }}
        />
        {property.featured && <div className="featured-badge">Featured</div>}
      </div>

      <div className="property-content">
        <div className="property-header">
          <h3 className="property-title">{property.title}</h3>
          {property.rating > 0 && (
            <div className="property-rating">
              <Star size={14} fill="currentColor" />
              <span>{property.rating}</span>
            </div>
          )}
        </div>

        <p className="property-location">
          <MapPin size={14} />
          {property.location}
        </p>

        <p className="property-description">{property.description}</p>

        <div className="property-details">
          <div className="detail-item">
            <Bed size={16} />
            <span>{property.bhk} BHK</span>
          </div>
          <div className="detail-item">
            <Bath size={16} />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="detail-item">
            <Square size={16} />
            <span>{property.size}</span>
          </div>
        </div>

        <div className="property-footer">
          <div className="property-price">
            {formatPrice(property.price, property.type)}
          </div>
          <div className={`property-type ${property.type}`}>
            {property.type === "sale" ? "For Sale" : "For Rent"}
          </div>
        </div>

        <div className="property-status">
          <Clock size={14} />
          <span>{property.status}</span>
        </div>

        {property.photos > 0 && (
          <div className="property-photos-count">
            📷 {property.photos} photos
          </div>
        )}
      </div>
    </div>
  );

  const FilterSidebar = () => (
    <div className={`filter-sidebar ${showFilters ? "mobile-visible" : ""}`}>
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="close-filters" onClick={() => setShowFilters(false)}>
          <X size={20} />
        </button>
      </div>

      <div className="filter-group">
        <label>Property Type</label>
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange("type", e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Price Range (₹)</label>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceRange[0]}
            onChange={(e) =>
              handleFilterChange("priceRange", [
                parseInt(e.target.value) || 0,
                filters.priceRange[1],
              ])
            }
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceRange[1]}
            onChange={(e) =>
              handleFilterChange("priceRange", [
                filters.priceRange[0],
                parseInt(e.target.value) || 50000000, // Increased max
              ])
            }
          />
        </div>
      </div>

      <div className="filter-group">
        <label>BHK</label>
        <select
          value={filters.bhk}
          onChange={(e) => handleFilterChange("bhk", e.target.value)}
        >
          <option value="all">Any BHK</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4 BHK</option>
          <option value="5">5+ BHK</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Location</label>
        <div className="location-input">
          <MapPin size={16} />
          <input
            type="text"
            placeholder="Enter location..."
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          />
        </div>
      </div>

      <div className="filter-actions">
        <button className="reset-btn" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="all-properties-page">
      <MyNavbar />

      {/* Header Section */}
      <section className="properties-header">
        <div className="container">
          <div className="header-content">
            <h1>Browse All Properties</h1>
            <p>Discover your perfect home from our extensive collection</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="properties-main">
        <div className="container">
          <div className="properties-layout">
            {/* Filter Sidebar */}
            <FilterSidebar />

            {/* Main Content */}
            <div className="properties-content">
              {/* Toolbar */}
              <div className="properties-toolbar">
                <div className="toolbar-left">
                  <button
                    className="filter-toggle"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal size={16} />
                    Filters
                  </button>
                  <span className="results-count">
                    {filteredProperties.length} properties found
                  </span>
                </div>

                <div className="toolbar-right">
                  <select
                    className="sort-select"
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Properties Grid */}
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading properties...</p>
                </div>
              ) : error ? (
                <div className="error-state">
                  <p>{error}</p>
                  <button onClick={fetchProperties}>Try Again</button>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="empty-state">
                  <Home size={48} />
                  <h3>No properties found</h3>
                  <p>Try adjusting your filters to see more results</p>
                  <button onClick={resetFilters}>Reset Filters</button>
                </div>
              ) : (
                <div className="properties-grid">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div
          className="mobile-overlay"
          onClick={() => setShowFilters(false)}
        ></div>
      )}

      {/* <FooterComponent /> */}
    </div>
  );
};

export default AllProperties;
