import React from 'react';
import './FooterComponent.css';
import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaYoutube, FaInstagram } from 'react-icons/fa6';

const FooterComponent = () => {
  return (

    <div className='container'>
    <footer className="footer bg-light text-dark py-4">
      <div className="container">
        <div className="row">

          {/* About Magicbricks */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">About Magicbricks</h6>
            <p className="text-muted mb-1">
              As the largest platform connecting property buyers and sellers, ...
              <a href="#" className="text-dark ms-1">Read more</a>
            </p>

            <h6 className="fw-bold mt-4">More from our Network</h6>
            <div className="d-flex gap-3">
              <span>Times Now</span>
              <span>ET Now</span>
            </div>

            <div className="d-flex gap-2 mt-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="store-badge" />
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="store-badge" />
            </div>

            <div className="social-icons mt-3 d-flex gap-3">
              <FaFacebookF />
              <FaXTwitter />
              <FaLinkedinIn />
              <FaYoutube />
              <FaInstagram />
            </div>
          </div>

          {/* Properties in India */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">Properties in India</h6>
            <p className="footer-links">
              Property in New Delhi | Property in Mumbai | Property in Chennai | Property in Pune | Property in Noida | Property in Gurgaon | Property in Bangalore | Property in Ahmedabad
            </p>

            <h6 className="fw-bold mt-4">New Projects in India</h6>
            <p className="footer-links">
              New Projects in New Delhi | New Projects in Mumbai | New Projects in Chennai | New Projects in Pune | New Projects in Noida | New Projects in Gurgaon | New Projects in Bangalore | New Projects in Ahmedabad
            </p>
          </div>

          {/* Property Services */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">Property Services</h6>
            <p className="footer-links">
              Home Loan | Home Interior
            </p>
          </div>
        </div>
      </div>
    </footer>

    </div>
  );
};

export default FooterComponent;
