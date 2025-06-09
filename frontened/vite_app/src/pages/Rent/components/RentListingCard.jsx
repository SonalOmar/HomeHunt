import React from "react";

function RentListingCard({ listing }) {
  return (
    <div className="card mb-3 p-2 shadow-sm">
      <h5>{listing.title}</h5>
      <p className="m-0">{listing.location}</p>
      <strong className="text-primary">{listing.price}</strong>
    </div>
  );
}

export default RentListingCard;
