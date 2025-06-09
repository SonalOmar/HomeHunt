import React from "react";
import { useState } from "react";
import ProfileMenu from "../Profile/profileMenu";
import "./Navbar.css";
import {
  Navbar,
  Nav, 
  NavDropdown,
  Form,
  FormControl,
  Button,
  Container,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const MyNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfile = () => setIsProfileOpen((prev) => !prev);
  return (
    <div>
      <div className="navbar1">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
          <Link className="navbar-brand fw-bold fs-3" to="/">
            Home<span style={{ color: "#27AE60" }}>Hunt</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav align-items-center gap-3">
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  Contact Us
                </Link>
              </li>
              <li className="nav-item dropdown position-relative">
                <button
                  className="btn nav-link border-0 bg-transparent"
                  onClick={toggleProfile}
                >
                  👤
                </button>

                {isProfileOpen && (
                  <div
                    className="profile-menu-container position-absolute"
                    style={{ top: "100%", right: 0 }}
                  >
                    <ProfileMenu />
                  </div>
                )}
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="navbar2">
        <Navbar bg="danger" variant="dark" expand="lg" sticky="top">
          <Container fluid className="px-3">
            {" "}
            {/* fluid removes default horizontal padding */}
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav className="d-flex">
                {" "}
                {/* Remove 'me-auto' */}
                <NavDropdown title="Buy" id="buy-dropdown">
                  <NavDropdown.Item as={Link} to="/buy/ready-to-move">
                    Ready to Move
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/buy/owner-properties">
                    Owner Properties
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/buy/budget-homes">
                    Budget Homes
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/buy/premium-homes">
                    Premium Homes
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/buy/new-projects">
                    New Projects
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Rent" id="rent-dropdown">
                  <div className="p-3">
                    <h6>Popular Choices</h6>
                    <hr />
                    <NavDropdown.Item as={Link} to="/rent/owner-properties">
                      Owner Properties
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/rent/verified-properties">
                      Verified Properties
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/rent/furnished-homes">
                      Furnished Homes
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/rent/bachelor-friendly">
                      Bachelor Friendly Homes
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/rent/immediate-available">
                      Immediately Available
                    </NavDropdown.Item>
                  </div>
                </NavDropdown>
                <NavDropdown
                  title="Sell"
                  id="sell-dropdown"
                  className="mega-menu"
                >
                  <div className="d-flex p-3 gap-5">
                    {/* For Owner */}
                    <div>
                      <h6>For Owner</h6>
                      <NavDropdown.Item as={Link} to="/sell/post-property">
                        Post Property{" "}
                        <span className="badge bg-warning text-dark">FREE</span>
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/sell/owner-dashboard">
                        My Dashboard
                      </NavDropdown.Item>
                      {/* <div className="mt-2">
                        <strong>Sell / Rent Ad Packages</strong>
                        <p className="small text-muted m-0">
                          +91 9870 260 930 / <Link to="/contact">Email Us</Link>
                        </p>
                      </div> */}
                    </div>

                    {/* For Agent & Builder */}
                    <div>
                      <h6>For Agent & Builder</h6>
                      <NavDropdown.Item as={Link} to="/sell/agent-dashboard">
                        My Dashboard
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/sell/developer-lounge">
                        Developer Lounge
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/sell/sales-enquiry">
                        Sales Enquiry
                      </NavDropdown.Item>
                      {/* <div className="mt-2">
                        <strong>Ad Packages</strong>
                        <p className="small text-muted m-0">0120-5135525</p>
                      </div> */}
                    </div>

                    {/* Selling Tools */}
                    <div>
                      <h6>Selling Tools</h6>
                      <NavDropdown.Item as={Link} to="/sell/property-valuation">
                        Property Valuation
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/sell/find-agent">
                        Find an Agent
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/sell/rates-trends">
                        Rates & Trends
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/sell/propworth">
                        PropWorth
                      </NavDropdown.Item>
                    </div>
                  </div>
                </NavDropdown>
                {/* <Nav.Link as={Link} to="/interiors">
                  Home Interiors
                </Nav.Link>
                <Nav.Link as={Link} to="/advice">
                  MB Advice
                </Nav.Link>
                <Nav.Link as={Link} to="/help">
                  Help
                </Nav.Link> */}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </div>
  );
};
export default MyNavbar;

