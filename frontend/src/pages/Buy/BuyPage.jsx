import React from "react";
import { useLocation } from "react-router-dom";
import dummyListings from "./data/dummyListings";
import PropertyCard from "./components/PropertyCard";

function BuyPage() {
  const location = useLocation();
  const pageType = location.pathname.split("/")[2] || "buy";

  const getHeading = () => {
    switch (pageType) {
      case "ready-to-move":
        return "Ready to Move Properties";
      case "owner-properties":
        return "Owner Properties";
      case "budget-homes":
        return "Budget Homes";
      case "premium-homes":
        return "Premium Homes";
      case "new-projects":
        return "New Projects";
      default:
        return "Buy Properties";
    }
  };

  // Filter listings based on URL pageType (simple match with type)
  const filteredListings = dummyListings.filter(
    (property) => property.type.toLowerCase().replace(/\s+/g, "-") === pageType
  );

  return (
    <div className="container mt-4">
      <h2>{getHeading()}</h2>
      <p>
        Showing listings for: <strong>{getHeading()}</strong>
      </p>

      {filteredListings.length > 0 ? (
        filteredListings.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))
      ) : (
        <p className="mt-3">No listings available for this category.</p>
      )}
    </div>
  );
}

export default BuyPage;
