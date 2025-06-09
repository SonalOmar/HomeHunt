import { Carousel } from "react-bootstrap";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import FooterComponent from "../components/FooterComponent";
import React from "react";
import MyNavbar from "../components/Navbar/Navbar"; // ✅ fix import
import TrendingPropertiesCarousel from "../components/Carousel/TrendingPropertiesCarousel";
import "./Home.css";
export default function Home() {
  return (
    <div>
      <MyNavbar />
        <Carousel fade indicators={false} controls={true} interval={3000}>
          <Carousel.Item>
            <img
              className="d-block w-100 carousel-image"
              src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80"
              alt="Slide 1"
            />
            <Carousel.Caption>
              <h3 className="carousel-title">Get Your Dream Home</h3>
              <p className="carousel-subtitle">Trendy styles at best prices</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 carousel-image"
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
              alt="Slide 2"
            />
            <Carousel.Caption>
              <h3 className="carousel-title">Get Your Dream Home</h3>
              <p className="carousel-subtitle">Trendy styles at best prices</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 carousel-image"
              src="https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/b2c4ff1742f1e6bb.jpg?q=20"
              alt="Slide 3"
            />
            <Carousel.Caption>
              <h3 className="carousel-title">Get Your Dream Home</h3>
              <p className="carousel-subtitle">Trendy styles at best prices</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <TrendingPropertiesCarousel />
        <FooterComponent />
      
    </div>
  );
}
