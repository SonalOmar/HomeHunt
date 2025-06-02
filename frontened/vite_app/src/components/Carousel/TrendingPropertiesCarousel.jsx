// TrendingPropertiesCarousel.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./TrendingPropertiesCarousel.css"; // Optional: for custom styles
import flat1 from "../../assets/images/flat1.jpg";
import flat2 from "../../assets/images/flat2.jpg";
import flat3 from "../../assets/images/flat3.jpg";
import flat7 from "../../assets/images/flat7.jpg";
import flat5 from "../../assets/images/flat5.jpg";
import flat6 from "../../assets/images/flat6.jpg";

const properties = [
  {
    id: 1,
    image: flat1,
    bhk: "3 BHK Flat",
    price: "₹2.55 Cr",
    size: "1817 sqft",
    location: "Channasandra, Bangalore",
    status: "Under Construction",
    photos: 31,
  },
  {
    id: 2,
    image:flat2,
    bhk: "2 BHK Flat",
    price: "₹78 Lac",
    size: "740 sqft",
    location: "Bagalur Main Road, Bangalore",
    status: "Ready to Move",
    photos: 7,
  },
  {
    id: 3,
    image: flat3,
    bhk: "3 BHK Flat",
    price: "₹2.75 Cr",
    size: "1917 sqft",
    location: "Manyata Tech Park, Bangalore",
    status: "Ready to Move",
    photos: 5,
  },
  {
    id: 4,
    image: flat7,
    bhk: "2 BHK Flat",
    price: "₹1 Cr",
    size: "1300 sqft",
    location: "Sorahunase, Bangalore",
    status: "Ready to Move",
    photos: 15,
  },
  {
    id: 5,
    image: flat5,
    bhk: "2 BHK Flat",
    price: "₹1 Cr",
    size: "1300 sqft",
    location: "Sorahunase, Bangalore",
    status: "Ready to Move",
    photos: 15,
  },
  {
    id: 6,
    image: flat6,
    bhk: "2 BHK Flat",
    price: "₹1 Cr",
    size: "1300 sqft",
    location: "Sorahunase, Bangalore",
    status: "Ready to Move",
    photos: 15,
  }
];

const TrendingPropertiesCarousel = () => {
  return (
    <div className="property-carousel-container">
      <h2>Trending Properties</h2>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={20}
        slidesPerView={1.2}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {properties.map((property) => (
          <SwiperSlide key={property.id}>
            <div className="property-card">
              <div className="property-image">
                <img src={property.image} alt={property.bhk} />
                <span className="photo-count">{property.photos}+</span>
              </div>
              <div className="property-info">
                <p className="bhk">{property.bhk}</p>
                <p className="price-size">
                  <strong>{property.price}</strong> |{" "}
                  <strong>{property.size}</strong>
                </p>
                <p>{property.location}</p>
                <p className="status">{property.status}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TrendingPropertiesCarousel;
