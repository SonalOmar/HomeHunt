import React from "react";

function PropertyCard({ property }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{property.title}</h5>
        <p className="card-text">{property.location}</p>
        <p className="card-text">
          <strong>{property.price}</strong>
        </p>
      </div>
    </div>
  );
}

export default PropertyCard;
