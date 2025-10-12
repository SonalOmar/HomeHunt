import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Home,
  Eye,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import MyNavbar from "../components/Navbar/Navbar";
import FooterComponent from "../components/FooterComponent";
import "./PropertyManagement.css";

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    type: "sale",
    bhk: "",
    size: "",
    status: "Available",
    amenities: [],
    featured: false,
    photos: 0,
    rating: 0,
    reviews: 0,
    image_urls: [],
  });

  const amenitiesList = [
    "Swimming Pool",
    "Gym",
    "Park",
    "Security",
    "Power Backup",
    "Lift",
    "Parking",
    "Garden",
    "Clubhouse",
    "Play Area",
  ];

  const fetchMyProperties = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/properties/user/my-properties",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched properties:", data);
        data.forEach((property) => {
          console.log(`Property: ${property.title}`, {
            image_urls: property.image_urls,
            photos: property.photos,
          });
        });
        setProperties(data);
      } else {
        console.error("Failed to fetch properties");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      const maxSize = 10 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        alert(
          `File ${file.name} is not a supported image type. Please use JPEG, PNG, WebP, or GIF.`
        );
        return false;
      }

      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }

      return true;
    });

    const newPreviews = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }));

    setImagePreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    const imageToRemove = imagePreviews[index];
    if (imageToRemove.isNew) {
      URL.revokeObjectURL(imageToRemove.preview);
    } else {
      setImagesToDelete((prev) => [...prev, imageToRemove.url]);
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    console.log("Submitting form with data:", formData);
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const url = editingProperty
        ? `http://localhost:8000/properties/${editingProperty._id}`
        : "http://localhost:8000/properties/";
      const method = editingProperty ? "PUT" : "POST";

      const formDataToSend = new FormData();

      if (editingProperty) {
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("price", parseFloat(formData.price));
        formDataToSend.append("location", formData.location);
        formDataToSend.append("type", formData.type);
        formDataToSend.append("bhk", formData.bhk || "");
        formDataToSend.append("size", formData.size || "");
        formDataToSend.append("status", formData.status);
        formDataToSend.append("amenities", JSON.stringify(formData.amenities));
        formDataToSend.append("featured", formData.featured);
        formDataToSend.append("photos", parseInt(formData.photos) || 0);
        formDataToSend.append("rating", parseFloat(formData.rating) || 0);
        formDataToSend.append("reviews", parseInt(formData.reviews) || 0);
      } else {
        const propertyData = {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          location: formData.location,
          type: formData.type,
          bhk: formData.bhk || null,
          size: formData.size || null,
          status: formData.status,
          amenities: formData.amenities,
          featured: formData.featured,
          photos: parseInt(formData.photos) || 0,
          rating: parseFloat(formData.rating) || 0,
          reviews: parseInt(formData.reviews) || 0,
        };
        formDataToSend.append("property_data", JSON.stringify(propertyData));
      }

      const newImages = imagePreviews.filter((img) => img.isNew);
      newImages.forEach((image, index) => {
        formDataToSend.append("image_urls", image.file);
      });

      if (editingProperty && imagesToDelete.length > 0) {
        imagesToDelete.forEach((url) => {
          formDataToSend.append("delete_images", url);
        });
      }

      console.log("Sending form data with images:", {
        method,
        newImages: newImages.length,
        deleteImages: imagesToDelete.length,
      });

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("Server response:", result);
        if (result.image_urls) {
          console.log("Images in response:", result.image_urls);
        }
        alert(
          editingProperty
            ? "Property updated successfully!"
            : "Property listed successfully!"
        );
        resetForm();
        fetchMyProperties();
      } else {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        alert(`Error: ${errorData.detail || "Failed to save property"}`);
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      alert("Error submitting property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title || "",
      description: property.description || "",
      price: property.price?.toString() || "",
      location: property.location || "",
      type: property.type || "sale",
      bhk: property.bhk || "",
      size: property.size || "",
      status: property.status || "Available",
      amenities: property.amenities || [],
      featured: property.featured || false,
      photos: property.photos?.toString() || "0",
      rating: property.rating?.toString() || "0",
      reviews: property.reviews?.toString() || "0",
      image_urls: property.image_urls || [],
    });

    const existingPreviews = (property.image_urls || []).map((url) => ({
      url,
      preview: `http://localhost:8000${url}`,
      isNew: false,
    }));

    setImagePreviews(existingPreviews);
    setImagesToDelete([]);
    setShowForm(true);
  };

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/properties/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Property deleted successfully!");
        fetchMyProperties();
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Error deleting property. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      location: "",
      type: "sale",
      bhk: "",
      size: "",
      status: "Available",
      amenities: [],
      featured: false,
      photos: 0,
      rating: 0,
      reviews: 0,
      image_urls: [],
    });
    imagePreviews.forEach((preview) => {
      if (preview.isNew) {
        URL.revokeObjectURL(preview.preview);
      }
    });
    setImagePreviews([]);
    setImagesToDelete([]);
    setEditingProperty(null);
    setShowForm(false);
  };

  return (
    <div className="pm-page">
      <MyNavbar />

      <div className="pm-container">
        {/* Header */}
        <div className="pm-header">
          <div className="pm-header-content">
            <h1 className="pm-title">Manage Your Properties</h1>
            <p>List, update, and manage your property listings</p>
          </div>
          <button className="pm-add-btn" onClick={() => setShowForm(true)}>
            <Plus size={20} />
            Add New Property
          </button>
        </div>

        {/* Debug Section */}
        <div className="pm-debug-section">
          <button
            onClick={() => {
              properties.forEach((p) => {
                console.log(`Property: ${p.title}`, {
                  hasImages: !!p.image_urls,
                  imageCount: p.image_urls?.length || 0,
                  imageUrls: p.image_urls,
                });
              });
            }}
            className="pm-debug-btn"
          >
            Debug Images
          </button>
        </div>

        {/* Property Form */}
        {showForm && (
          <div className="pm-form-overlay">
            <div className="pm-form-container">
              <div className="pm-form-header">
                <h2>
                  {editingProperty ? "Edit Property" : "List New Property"}
                </h2>
                <button className="pm-close-btn" onClick={resetForm}>
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="pm-form">
                <div className="pm-form-grid">
                  {/* Basic Information */}
                  <div className="pm-form-group">
                    <label>Property Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Beautiful 3 BHK Apartment"
                      required
                    />
                  </div>

                  <div className="pm-form-group">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="pm-form-group">
                    <label>Property Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>

                  <div className="pm-form-group">
                    <label>BHK Configuration</label>
                    <input
                      type="text"
                      name="bhk"
                      value={formData.bhk}
                      onChange={handleInputChange}
                      placeholder="e.g., 3 BHK, 2 BHK"
                    />
                  </div>

                  <div className="pm-form-group">
                    <label>Size</label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      placeholder="e.g., 1817 sqft"
                    />
                  </div>

                  <div className="pm-form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="Available">Available</option>
                      <option value="Under Construction">
                        Under Construction
                      </option>
                      <option value="Ready to Move">Ready to Move</option>
                      <option value="Sold">Sold</option>
                      <option value="Rented">Rented</option>
                    </select>
                  </div>

                  <div className="pm-form-group">
                    <label>Rating (0-5)</label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="4.8"
                    />
                  </div>

                  <div className="pm-form-group">
                    <label>Number of Reviews</label>
                    <input
                      type="number"
                      name="reviews"
                      value={formData.reviews}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="Number of reviews"
                    />
                  </div>

                  <div className="pm-form-group pm-full-width">
                    <label className="pm-checkbox-label">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                      />
                      Featured Property
                    </label>
                  </div>

                  <div className="pm-form-group pm-full-width">
                    <label>Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter complete address"
                      required
                    />
                  </div>

                  <div className="pm-form-group pm-full-width">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your property in detail..."
                      rows="4"
                      required
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div className="pm-form-group pm-full-width">
                    <label>Property Images</label>
                    <div className="pm-image-upload-section">
                      <div className="pm-image-upload-area">
                        <input
                          type="file"
                          id="pm-property-images"
                          multiple
                          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                          onChange={handleImageUpload}
                          style={{ display: "none" }}
                        />
                        <label
                          htmlFor="pm-property-images"
                          className="pm-image-upload-btn"
                        >
                          <Upload size={20} />
                          Upload Images
                          <span>JPEG, PNG, WebP, GIF (Max 10MB each)</span>
                        </label>
                      </div>

                      {imagePreviews.length > 0 && (
                        <div className="pm-image-previews">
                          <h4>Selected Images ({imagePreviews.length})</h4>
                          <div className="pm-preview-grid">
                            {imagePreviews.map((image, index) => (
                              <div key={index} className="pm-image-preview">
                                <img
                                  src={image.preview}
                                  alt={`Preview ${index + 1}`}
                                />
                                <button
                                  type="button"
                                  className="pm-remove-image-btn"
                                  onClick={() => removeImage(index)}
                                >
                                  <X size={14} />
                                </button>
                                {!image.isNew && (
                                  <div className="pm-existing-badge">
                                    Existing
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amenities Section */}
                  <div className="pm-form-group pm-full-width">
                    <label>Amenities</label>
                    <div className="pm-amenities-grid">
                      {amenitiesList.map((amenity) => (
                        <label key={amenity} className="pm-amenity-checkbox">
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={() => handleAmenityChange(amenity)}
                          />
                          <span>{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pm-form-actions">
                  <button
                    type="button"
                    className="pm-cancel-btn"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="pm-submit-btn"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editingProperty
                      ? "Update Property"
                      : "List Property"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Properties List */}
        <div className="pm-properties-list">
          <div className="pm-list-header">
            <h3>My Properties ({properties.length})</h3>
          </div>

          {properties.length === 0 ? (
            <div className="pm-empty-state">
              <Home size={48} />
              <h4>No Properties Listed</h4>
              <p>Start by listing your first property to get started.</p>
              <button
                className="pm-add-first-btn"
                onClick={() => setShowForm(true)}
              >
                <Plus size={20} />
                List Your First Property
              </button>
            </div>
          ) : (
            <div className="pm-properties-grid">
              {properties.map((property) => (
                <div key={property._id} className="pm-property-card">
                  <div className="pm-property-image">
                    {property.image_urls && property.image_urls.length > 0 ? (
                      <>
                        <img
                          src={`http://localhost:8000${property.image_urls[0]}`}
                          alt={property.title}
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              `${property.image_urls[0]}`
                            );
                            e.target.style.display = "none";
                          }}
                          onLoad={(e) => {
                            const placeholder = e.target.nextSibling;
                            if (placeholder) {
                              placeholder.style.display = "none";
                            }
                          }}
                        />
                        <div
                          className="pm-image-placeholder"
                          style={{ display: "none" }}
                        >
                          <ImageIcon size={40} />
                        </div>
                      </>
                    ) : (
                      <div className="pm-image-placeholder">
                        <ImageIcon size={40} />
                      </div>
                    )}
                    {property.featured && (
                      <div className="pm-featured-badge">Featured</div>
                    )}
                    <div className="pm-image-count">
                      <ImageIcon size={16} />
                      {property.image_urls?.length || 0}
                    </div>
                  </div>

                  <div className="pm-property-details">
                    <h4>{property.title}</h4>
                    <p className="pm-property-location">{property.location}</p>
                    <div className="pm-property-meta">
                      <span className="pm-price">
                        ₹{property.price?.toLocaleString()}
                      </span>
                      <span className={`pm-type pm-type-${property.type}`}>
                        {property.type === "sale" ? "For Sale" : "For Rent"}
                      </span>
                    </div>
                    {property.bhk && (
                      <div className="pm-property-features">
                        <span>{property.bhk}</span>
                        {property.size && <span>{property.size}</span>}
                        {property.rating > 0 && (
                          <span>⭐ {property.rating}</span>
                        )}
                      </div>
                    )}
                    <p className="pm-property-description">
                      {property.description.length > 100
                        ? `${property.description.substring(0, 100)}...`
                        : property.description}
                    </p>
                    {property.amenities && property.amenities.length > 0 && (
                      <div className="pm-property-amenities">
                        <strong>Amenities: </strong>
                        {property.amenities.slice(0, 3).join(", ")}
                        {property.amenities.length > 3 && "..."}
                      </div>
                    )}
                  </div>

                  <div className="pm-property-actions">
                    <button
                      className="pm-action-btn pm-view-btn"
                      onClick={() =>
                        window.open(`/property/${property._id}`, "_blank")
                      }
                      title="View Property"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="pm-action-btn pm-edit-btn"
                      onClick={() => handleEdit(property)}
                      title="Edit Property"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="pm-action-btn pm-delete-btn"
                      onClick={() => handleDelete(property._id)}
                      title="Delete Property"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <FooterComponent />
    </div>
  );
};

export default PropertyManagement;
