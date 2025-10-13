import React from "react";
import { useLocation } from "react-router-dom";
import dummyRentListings from "./components/DummyListings";
import RentListingCard from "./components/RentListingCard";

function RentPage() {
  const location = useLocation();
  const rentType = location.pathname.split("/")[2] || "rent";

  const getHeading = () => {
    switch (rentType) {
      case "owner-properties":
        return "Owner Properties";
      case "verified-properties":
        return "Verified Properties";
      case "furnished-homes":
        return "Furnished Homes";
      case "bachelor-friendly":
        return "Bachelor Friendly Homes";
      case "immediately-available":
        return "Immediately Available";
      default:
        return "Rent Properties";
    }
  };

  // Filter listings according to URL path
  const filteredListings = dummyRentListings.filter(
    (listing) => listing.type === rentType
  );

  return (
    <div className="container mt-4">
      <h2>{getHeading()}</h2>
      <p>
        Showing listings for: <strong>{getHeading()}</strong>
      </p>

      <div className="mt-3">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <RentListingCard key={listing.id} listing={listing} />
          ))
        ) : (
          <p>No listings found for this category.</p>
        )}
      </div>
    </div>
  );
}

export default RentPage;
